const { cleanEnv, str, port, bool } = require('envalid');

function validateEnv() {
  cleanEnv(process.env, {
    DATABASE_URL: str({ desc: 'PostgreSQL database connection string' }),
    ACCESS_TOKEN_SECRET: str({ desc: 'JWT secret for signing access tokens' }),
    REFRESH_TOKEN_SECRET: str({ desc: 'JWT secret for signing refresh tokens' }),
    SENDGRID_API_KEY: str({ desc: 'SendGrid API key for emails', default: 'test' }),
    PORT: port({ default: 3001 }),
    REQUIRES_AUTH: str({ default: 'true' })
  });
}

module.exports = validateEnv;
