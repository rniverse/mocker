const { Strategy } = require('passport-local');
const mongoose = require('mongoose');
const { handlePromise, Logger } = require('root/utils');

const logger = Logger.child({ service: 'PASSPORT_LCL_STRTGY' });
logger.trace('Local Strategy initialized');

module.exports = new Strategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, cb) => {
  const User = mongoose.model('User');
  const response = await handlePromise(User.signin({ username, password }));
  const { ok } = response;
  if (!ok) return cb(response);
  return cb(null, response);
});
