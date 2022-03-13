var morgan = require('morgan');
const moment = require('moment');
var rfs = require('rotating-file-stream'); // version 2.x
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

module.exports = (app) => {
  // create a rotating write stream
  var accessLogStream = rfs.createStream(
    `${moment().format('YYYYMMDD')}-access.log`,
    {
      interval: '1d', // rotate daily
      path: `/${appDir}/data/logs/`
    }
  );

  // setup the logger
  app.use(
    morgan('combined', {
      stream: accessLogStream
    })
  );
};
