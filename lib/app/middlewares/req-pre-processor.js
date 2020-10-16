const { Logger } = require('root/utils');

const logger = Logger.child({ service: 'RQ_PRE_PRCR_MW' });
logger.trace('Reques Pre-Processor middleware initialized');

module.exports = (req, res, time) => {
  const user = req.user ? req.user._id : '';
  logger.debug('%s - [%s] Route hit - [%s] %s took : %d ms',
    user, res.statusCode, req.method, req.originalUrl, time);
};
