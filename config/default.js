const parsers = {
  getInt: (input, onFail = 0) => {
    const n = parseInt(input, 10);
    return !isNaN(n) ? n : onFail;
  }
};
module.exports = {
  get MONGO_URI() { return process.env.MONGO_URI || 'mongodb://localhost:6017'; },
  get MONGO_USER() { return process.env.MONGO_USER; },
  get MONGO_PASSWORD() { return process.env.MONGO_PASSWORD; },
  get MONGO_DATABASE() { return process.env.MONGO_DATABASE || 'mocker_dev'; },
  get MONGO_TEST_DATABASE() { return process.env.MONGO_DATABASE || 'mocker_test'; },
  get MONGO_AUTH_SOURCE() { return process.env.MONGO_AUTH_SOURCE; },
  get MONGO_AUTO_INDEX() { return process.env.MONGO_AUTO_INDEX || true; },
  get MONGO_CONNECTION_TIMEOUT() {
    return parsers.getInt(process.env.MONGO_CONNECTION_TIMEOUT, 30000);
  },
  get MONGO_SOCKET_TIMEOUT() { return parsers.getInt(process.env.MONGO_SOCKET_TIMEOUT, 30000); },
  get MONGO_POOL_SIZE() { return parsers.getInt(process.env.MONGO_POOL_SIZE, 10); },
  get MAX_FETCH_LIMIT() { return parsers.getInt(process.env.MAX_FETCH_LIMIT, 1000); },
  get APP_SERVER_HOST() { return process.env.HOST || '0.0.0.0'; },
  get APP_SERVER_PORT() {
    return parsers.getInt(process.env.PORT, 9091);
  },
  get NODE_ENV() { return process.env.NODE_ENV || 'development'; },
  get RESET_PASSWORD_EXPIRES_IN_MINUTES() {
    return parsers.getInt(process.env.RESET_PASSWORD_EXPIRES_IN || 15);
  },
  get APP_AUTH_JWT_KEY() { return process.env.RESET_PASSWORD_EXPIRES_IN || 'abcd@1234$POIU'; },
  get APP_AUTH_JWT_EXPIRES_IN_MINUTES() {
    return parsers.getInt(process.env.RESET_PASSWORD_EXPIRES_IN, 2 * 60);
  },
  get APP_LOG_LEVEL() {
    /* allowed value [trace, debug, info, warn, error] */
    return process.env.APP_LOG_LEVEL || 'trace';
  }
};
