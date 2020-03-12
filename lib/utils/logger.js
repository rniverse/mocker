const config = require('config');
module.exports = require('pino')({
  prettyPrint: {
    colorize: true,
    messageFormat: '[{service}] {msg}',
    ignore: 'service,hostname,pid',
    translateTime: true
  },
  level: config.get('APP_LOG_LEVEL')
});
