const qs = require('qs');
const { Logger } = require('root/utils');

const logger = Logger.child({ service: 'RQ_PRE_PRCR_MW' });
logger.trace('Reques Pre-Processor middleware initialized');

module.exports = (req, _res, next) => {
  const url = req.originalUrl;

  req.time = Date.now();
  req.on('close', () => {
    const time = Date.now() - req.time;
    logger.debug('Route hit - [%s] %s took : %d ms',
      req.method, req.originalUrl, time);
  });

  const queryIndex = url.indexOf('?');
  const queryString = url.substr(queryIndex + 1);
  req.query = qs.parse(queryString);
  next();
};
