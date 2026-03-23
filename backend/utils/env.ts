import { cleanEnv, str, port } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    DATABASE_URL: str({ desc: 'PostgreSQL database connection string' }),
    ACCESS_TOKEN_SECRET: str({ desc: 'JWT secret for signing access tokens' }),
    REFRESH_TOKEN_SECRET: str({
      desc: 'JWT secret for signing refresh tokens',
    }),
    SENDGRID_API_KEY: str({
      desc: 'SendGrid API key for emails',
      default: 'test',
    }),
    PORT: port({ default: 3001 }),
    REQUIRES_AUTH: str({ default: 'true' }),
    BACKEND_URL: str({
      default: 'http://localhost:3001',
      desc: 'Public URL of this API server',
    }),
    FRONTEND_URL: str({
      default: 'http://localhost:3000',
      desc: 'Allowed frontend origin for CORS',
    }),
  });
}

export default validateEnv;
