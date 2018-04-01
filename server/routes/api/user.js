const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const User = mongoose.model('User');
const auth = require('../auth');

const defaultSettings = {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  totalSessions: 4
}

router.post('/', (req, res, next) => {
  const user = new User();

  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user.settings = {...defaultSettings};

  user.save().then( () => {
    return res.json({user: user.toAuthJSON()});
  }).catch(next);

})

router.post('/login', (req, res, next) => {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: {email: "can't be blank"}});
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', { seesion: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});



module.exports = router;