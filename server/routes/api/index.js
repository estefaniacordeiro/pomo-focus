const router = require('express').Router();


router.use('/user', require('./user'));
router.use('/settings', require('./settings'));
router.use('/tasks', require('./tasks'));

router.use( (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce( (errors, key) => {
        console.log(errors);
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    })
  }
  return next(err);
})

module.exports = router;