var morgan = require('morgan');
const moment = require('moment');
var rfs = require('rotating-file-stream'); // version 2.x
const { dirname, resolve } = require('path');
const appDir = dirname(require.main?.filename || resolve(__dirname, '../index.ts'));

module.exports = (app) => {
  // create a rotating write stream
  var accessLogStream = rfs.createStream(`${moment().format('YYYYMMDD')}-access.log`, {
    interval: '1d', // rotate daily
    path: `${appDir}/data/logs/`,
  });

  // setup the logger
  app.use(
    morgan('combined', {
      stream: accessLogStream,
    }),
  );
};
