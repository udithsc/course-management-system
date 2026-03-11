const { validate: isUuid } = require('uuid');

module.exports = (req, res, next) => {
  if (req.params.id && !isUuid(req.params.id))
    return res.status(400).send('Invalid ID.');

  if (req.body.id && !isUuid(req.body.id))
    return res.status(400).send('Invalid ID.');

  next();
};
