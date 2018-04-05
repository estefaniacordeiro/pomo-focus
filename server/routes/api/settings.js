const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const auth = require('../auth');

router.get('/', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    return res.json({ settings: user.settings });
  }).catch(next);
});

router.put('/', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    const newSettings = req.body.settings;
    user.settings = newSettings;
    user.save().then( () => {
      return res.json({settings: newSettings});
    }).catch(next);
  }).catch(next);
})

module.exports = router;