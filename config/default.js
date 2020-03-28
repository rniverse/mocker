module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:6017',
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_DATABASE: process.env.MONGO_DATABASE || 'mocker_dev',
  MONGO_TEST_DATABASE: process.env.MONGO_DATABASE || 'mocker_test',
  MONGO_AUTH_SOURCE: process.env.MONGO_AUTH_SOURCE,
  MONGO_AUTO_INDEX: process.env.MONGO_AUTO_INDEX || true,
  MONGO_CONNECTION_TIMEOUT: process.env.MONGO_CONNECTION_TIMEOUT || 30000,
  MONGO_SOCKET_TIMEOUT: process.env.MONGO_CONNECTION_TIMEOUT || 30000,
  MONGO_POOL_SIZE: process.env.MONGO_POOL_SIZE || 10,
  APP_SERVER_HOST: process.env.APP_SERVER_HOST || '0.0.0.0',
  APP_SERVER_PORT: process.env.APP_SERVER_PORT || 9091,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  RESET_PASSWORD_EXPIRES_IN_MINUTES: process.env.RESET_PASSWORD_EXPIRES_IN || 15,
  APP_AUTH_JWT_KEY: process.env.RESET_PASSWORD_EXPIRES_IN || 'abcd@1234$POIU',
  APP_AUTH_JWT_EXPIRES_IN_MINUTES: process.env.RESET_PASSWORD_EXPIRES_IN || 2 * 60,
  APP_LOG_LEVEL: process.env.APP_LOG_LEVEL || 'trace' // allowed value [trace, debug, info, warn, error]
};
