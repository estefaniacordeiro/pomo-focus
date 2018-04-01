const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const auth = require('../auth');

// Get task list
router.get('/all', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    return res.json({
      tasks: user.tasks
    });
  }).catch(next);
})

// Add new task
router.post('/', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    const { name, lastUpdated } = req.body.task;
    if (!name || !lastUpdated || !stats) {
      return res.sendStatus(400);
    } else {
      const newTask = { 
        name, 
        lastUpdated, 
        stats: { 
          totalMinutes: 0,
        }}
      user.tasks.push(newTask);
      user.save().then( () => {
        return res.sendStatus(204);
      }).catch(next);
    }
  }).catch(next);
})

// Add stats to task
router.put('/stats', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    const { _id, lastUpdated, focusTime, endedAt, date } = req.body.task;

    if (!_id || !lastUpdated || !focusTime || !endedAt || !date) {
      return res.sendStatus(400);
    } 
    
    const currentTask = user.tasks.id(_id);
    const stats = currentTask.stats;
    currentTask.lastUpdated = lastUpdated;
    stats.totalMinutes += focusTime;
    if (!stats[date]) {
      stats[date] = [ { endedAt, focusTime } ];
    } else {
      stats[date].push({ endedAt, focusTime});
    }
    currentTask.markModified('stats');
    user.save().then( () => {
      res.sendStatus(204);
    }).catch(next);
  }).catch(next);
})

// Change task name
router.put('/name', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    const { name, _id } = req.body.task;
    user.tasks.id(_id).name = name;

    user.save().then( () => {
      return res.sendStatus(204);
    }).catch(next);

  }).catch(next);
})

// Delete task
router.delete('/', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    const { _id } = req.body.task;
    user.tasks.pull(_id);
    user.save().then( () => {
      return res.sendStatus(204);
    }).catch(next);
  }).catch(next);
})


module.exports = router;