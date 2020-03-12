const mongoose = require('mongoose');
const config = require('config');
const { Logger } = require('root/utils');

// eslint-disable-next-line no-unused-vars
const models = require('root/models');

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

const logger = Logger.child({ service: 'DB_MONGO' });
logger.trace('Mongoose has been initialized');

module.exports = class MongoDb {
  static _parseOptions(opts) {
    const {
      dbName: overrideDbName,
      authSource: overrideAuthSource,
      poolSize: overridePoolSize,
      auth: overrideAuth,
      autoIndex: overrideAutoIndex
    } = opts || {};
    const {
      MONGO_URI: uri,
      MONGO_USER: user,
      MONGO_PASSWORD: password,
      MONGO_DATABASE: dbName,
      MONGO_AUTH_SOURCE: authSource,
      MONGO_AUTO_INDEX: autoIndex,
      MONGO_CONNECTION_TIMEOUT: connectTimeoutMS,
      MONGO_SOCKET_TIMEOUT: socketTimeoutMS,
      MONGO_POOL_SIZE: poolSize,
    } = config;
    const options = {
      uri,
      opts: {
        autoIndex: overrideAutoIndex || autoIndex,
        connectTimeoutMS,
        socketTimeoutMS,
        poolSize: overridePoolSize || poolSize,
      },
    };
    if (authSource) {
      options.authSource = overrideAuthSource || authSource;
    }
    if (dbName) {
      options.opts.dbName = overrideDbName || dbName;
    }
    if (user && password) {
      options.auth = { user, password };
    }
    if (overrideAuth) {
      options.auth = overrideAuth;
    }
    return options;
  }

  static async connect(options) {
    const {
      uri,
      opts,
    } = MongoDb._parseOptions(options);
    return mongoose.connect(uri, opts);
  }
};
