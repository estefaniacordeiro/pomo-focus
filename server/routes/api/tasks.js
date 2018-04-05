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
    if (!name || !lastUpdated ) {
      return res.sendStatus(422);
    } else {
      const newTask = { 
        name, 
        lastUpdated, 
        stats: { 
          totalMinutes: 0,
        }}
      user.tasks.push(newTask);
      user.save().then( () => {
        return res.json({
          newTask: user.tasks.slice(-1)[0]
        });
      }).catch(next);
    }
  }).catch(next);
})

// Add stats to task
router.put('/', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then( user => {
    if (!user) {
      return res.sendStatus(401);
    }

    const { _id, lastUpdated, focusTime, endedAt, date } = req.body.task;

    if (!_id) {
      return res.sendStatus(422);
    } 
    
    const currentTask = user.tasks.id(_id);

    if (lastUpdated) {
      currentTask.lastUpdated = lastUpdated;
    }
    // Add stats
    if (focusTime && endedAt && date) {
      const stats = currentTask.stats;
  
      stats.totalMinutes += focusTime;
      if (!stats[date]) {
        stats[date] = [ { endedAt, focusTime } ];
      } else {
        stats[date].push({ endedAt, focusTime});
      }
      currentTask.markModified('stats');
    }
    // Move the current task to the end of the array
    const index = user.tasks.indexOf(currentTask);
    user.tasks.splice(index, 1);
    user.tasks.push(currentTask);

    user.save().then( () => {
      res.json({ success: true, currentTask });
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