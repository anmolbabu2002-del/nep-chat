// Production configuration
module.exports = {
  // Redis configuration
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/chatapp',
  SQLITE_DB: process.env.SQLITE_DB || './chatapp.db',

  // Session configuration
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-in-production',

  // Server configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,

  // File upload configuration
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB

  // CORS origins (add your frontend domains in production)
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*']
};
