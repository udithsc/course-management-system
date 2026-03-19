require('express-async-errors');
const express = require('express');
require('dotenv').config();
const { dirname } = require('path');
const validateEnv = require('./utils/env');

// Validate env vars first
validateEnv();

const app = express();
const appDir = dirname(require.main.filename);
const logger = require('./utils/logger');

// Startup modules
require('./startup/security')(app);
require('./startup/http')(app);
require('./startup/cors')(app);
require('./startup/routes')(app);
require('./startup/swagger')(app);
require('./startup/db')();

// Static file serving
app.use('/files', express.static(`${appDir}/data/uploads`));

// Start server
const port = process.env.PORT || 3001;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;
