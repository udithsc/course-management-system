import express from 'express';
import 'dotenv/config';
import path from 'path';
import validateEnv from './utils/env';

// Validate env vars first
validateEnv();

const app = express();
import logger from './utils/logger';

// Startup modules (assuming they will be converted to export default)
import securityStartup from './startup/security';
import httpStartup from './startup/http';
import corsStartup from './startup/cors';
import routesStartup from './startup/routes';
import swaggerStartup from './startup/swagger';
import dbStartup from './startup/db';

securityStartup(app);
httpStartup(app);
corsStartup(app);
routesStartup(app);
swaggerStartup(app);
dbStartup();

app.use('/files', express.static(path.join(process.cwd(), 'uploads')));

// Start server
const port = process.env.PORT || 3001;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

export default server;
