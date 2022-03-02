var morgan = require('morgan');
const moment = require('moment');
var rfs = require('rotating-file-stream'); // version 2.x

module.exports = (app) => {
  // create a rotating write stream
  var accessLogStream = rfs.createStream(
    `${moment().format('YYYYMMDD')}-access.log`,
    {
      interval: '1d', // rotate daily
      path: `/app/data/logs/`
    }
  );

  // setup the logger
  app.use(
    morgan('combined', {
      stream: accessLogStream
    })
  );
};
