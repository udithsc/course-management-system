const express = require('express');
require('dotenv').config();
const config = require('config');
const app = express();
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const logger = require('./utils/logger');
require('./startup/http')(app);
require('./startup/cors')(app);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

app.use('/files', express.static(`${appDir}/data/uploads`));
app.use('/resources', express.static(`/${appDir}/resources`));

const port = process.env.PORT || config.get('port');
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;
