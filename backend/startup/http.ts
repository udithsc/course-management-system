import morgan from 'morgan';
import moment from 'moment';
import * as rfs from 'rotating-file-stream';
import path from 'path';

const appDir = process.cwd();

export default (app: any) => {
  // create a rotating write stream
  var accessLogStream = rfs.createStream(`${moment().format('YYYYMMDD')}-access.log`, {
    interval: '1d', // rotate daily
    path: path.join(appDir, 'data/logs/'),
  });

  // setup the logger
  app.use(
    morgan('combined', {
      stream: accessLogStream,
    }),
  );
};
