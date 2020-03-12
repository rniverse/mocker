const { ExtractJwt, Strategy } = require('passport-jwt');
const mongoose = require('mongoose');
const config = require('config');
const { Logger } = require('root/utils');

const logger = Logger.child({ service: 'PASSPORT_JWT_STRTGY' });
logger.trace('JWT Strategy initialized');

module.exports = new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('APP_AUTH_JWT_KEY')
}, (payload, cb) => {
  const User = mongoose.model('User');
  return User.findById(payload._id)
    .removeSensitive()
    .lean(true)
    .then((user) => {
      if (!user) return cb({ ok: false, error: new Error('User record not found') });
      return cb(null, { ok: true, result: user });
    })
    .catch((err) => cb({ ok: false, error: err }));
});
