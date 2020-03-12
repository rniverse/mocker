const passport = require('passport');
const { SendResponse, Logger } = require('root/utils');

const logger = Logger.child({ service: 'JWT_MW' });
logger.trace('JWT middleware initialized');

module.exports = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.toLowerCase().includes('bearer')) {
    return SendResponse.unauthorizedRequestError(res, {
      ok: false,
      error: new Error('Unauthorized')
    });
  }
  return passport
    .authenticate('jwt', {
      session: false
    }, (authenticateErr, response) => {
      if (authenticateErr) return SendResponse.unauthorizedRequestError(res, response);
      if (!response) {
        return SendResponse.unauthorizedRequestError(res, {
          ok: false,
          error: new Error('Unauthorized')
        });
      }
      const { ok, result } = response;
      if (!ok) return SendResponse.unauthorizedRequestError(res, response);
      req.user = result;
      if (req.user && req.user._id) {
        req.query = Object.assign(req.query || {}, { user: req.user._id });
        if (['POST', 'PUT'].includes(req.method)) {
          req.body.user = req.user._id;
        }
      }
      return next(null);
    })(req, res, next);
};
