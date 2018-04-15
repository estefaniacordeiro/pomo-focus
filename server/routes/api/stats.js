const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const auth = require('../auth');

router.get('/all', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    return res.json({
      stats: user.stats
    });
  }).catch(next);
})

router.get('/', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    const date = req.query.date;
    const stats = user.stats[date];
    return res.json({stats})
  }).catch(next);
})

// Add a completed task to stats
router.post('/', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    const { date, endedAt, focusTime, _id, name } = req.body.stats;

    if ( !date || !endedAt || !_id || !focusTime) {
      return res.sendStatus(422);
    }

    if (!user.stats[date]) {
      user.stats[date] = [{ _id, name, endedAt, focusTime }];
    } else {
      user.stats[date].push({ _id, name, endedAt, focusTime });
    }
    user.markModified('stats');
    user.save().then( () => {
      return res.json({ success: true, stats: { [date]: user.stats[date]}});
    }).catch(next);
  }).catch(next);
})

module.exports = router;