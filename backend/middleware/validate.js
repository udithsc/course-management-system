const mongoose = require('mongoose');

module.exports = (validator) => (req, res, next) => {
  if (req.body.id && !mongoose.Types.ObjectId.isValid(req.body.id))
    return res.status(400).send('Invalid ID.');

  if (validator) {
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  }

  next();
};
