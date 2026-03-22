/**
 * testApp.ts
 * Creates a bare Express app wired with all middlewares and routes
 * but WITHOUT calling server.listen(), so supertest can bind its own
 * ephemeral port on each test run.
 */
const express = require('express');
require('dotenv').config();

const app = express();
require('../startup/security')(app);
require('../startup/http')(app);
require('../startup/cors')(app);
require('../startup/routes')(app);

export default app;
