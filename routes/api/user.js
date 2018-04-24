const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const User = mongoose.model('User');
const auth = require('../auth');

// Get user email and token
router.get('/', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(422);
    }

    return res.json({ user: user.toAuthJSON()});
  }).catch(next);
});

// Register
router.post('/', (req, res, next) => {
  User.findOne({email: req.body.user.email }, (err, doc) => {
    if(doc) {
      return next({status: 422, message: "Email existed!"});
    }
  })
  const user = new User();

  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user.save().then( () => {
    return res.json({user: user.toAuthJSON()});
  }).catch(next);

})

// Login
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