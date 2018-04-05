const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const auth = require('../auth');

router.get('/', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    return res.json({
      stats: user.stats
    });
  }).catch(next);
})

// Add a completed task to stats
router.post('/', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    const { date, endedAt, task, focusTime } = req.body.stats;

    if ( !date || !endedAt || !task || !focusTime) {
      return res.sendStatus(422);
    }

    if (!user.stats[date]) {
      user.stats[date] = [{ endedAt, task, focusTime }];
    } else {
      user.stats.push({ endedAt, task, focusTime });
    }
    user.markModified('stats');
    user.save().then( () => {
      return res.json({ success: true, stats: { [date]: user.stats[date]}});
    }).catch(next);
  }).catch(next);
})

module.exports = router;