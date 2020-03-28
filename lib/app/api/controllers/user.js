const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const {
  handlePromise,
  Logger,
  SendResponse,
  Basics
} = require('root/utils');
const passport = require('passport');
const getBaseCtrl = require('./base');

const primaryModel = 'User';

const BaseCtrl = getBaseCtrl({ primaryModel });

const logger = Logger.child({ service: 'USR_CTRLR' });
logger.trace('User controller initialized');

const tokenHandler = (req, res, response) => {
  const { ok } = response || {};
  if (!ok) return SendResponse.unauthorizedRequestError(res, response);
  let { result: authUser } = response;
  if (authUser instanceof mongoose.Document) {
    authUser = authUser.toObject();
  }
  return req.login(authUser, { session: false }, (reqLoginErr) => {
    if (reqLoginErr) return SendResponse.unauthorizedRequestError(res, response);
    const token = jwt.sign(authUser,
      config.get('APP_AUTH_JWT_KEY'),
      {
        expiresIn: config.get('APP_AUTH_JWT_EXPIRES_IN_MINUTES') * 60
      });
    /**
     * TODO: if possible store token somewhere so that,
     * on signout we can remove the stored token
     */
    return SendResponse.success(res, { ok: true, result: { token, authUser } });
  });
};

module.exports = class UserCtrl extends BaseCtrl {
  static async signin(req, res) {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return SendResponse.badRequestError(res, {
        ok: false,
        error: new Error('Missing required parameters')
      });
    }
    return passport.authenticate('local', { session: false }, (authenticateErr, response) => {
      if (authenticateErr) return SendResponse.unauthorizedRequestError(res, authenticateErr);
      return tokenHandler(req, res, response);
    })(req, res);
  }

  static async signup(req, res) {
    const User = mongoose.model('User');
    const response = await handlePromise(User.signup(req.body));
    return tokenHandler(req, res, response);
  }

  static async signout(req, res) {
    // TODO: expire token here
    return SendResponse.success(res, { ok: true, data: null });
  }

  static async forgotPassword(req, res) {
    const User = mongoose.model('User');
    const code = Basics.generateRandomString(24);
    req.body.code = code;
    const response = await handlePromise(User.forgotPassword(req.body));
    logger.debug(`${primaryModel} forgot password for user ${req.body.username}`, response);
    const { ok, result } = response;
    if (!ok) return SendResponse.badRequestError(res, response);
    if (!result) {
      return SendResponse.badRequestError(res, {
        ok: false,
        error: new Error('User record not found')
      });
    }
    /**
     * TODO: send code here
     */
    return SendResponse.success(res, response);
  }

  static async resetPassword(req, res) {
    const User = mongoose.model('User');
    const response = await handlePromise(User.resetPassword(req.body));
    logger.debug(`${primaryModel} reset password for user ${req.body.username}`, response);
    const { ok, result } = response;
    if (!ok) return SendResponse.badRequestError(res, response);
    if (!result) {
      return SendResponse.badRequestError(res, {
        ok: false,
        error: new Error('User record not found')
      });
    }
    /**
     * TODO: send reset password change response here
     */
    return SendResponse.success(res, response);
  }

  static async changePassword(req, res) {
    const User = mongoose.model('User');
    const response = await handlePromise(User.changePassword(req.body));
    logger.debug(`${primaryModel} change password for user ${req.body.user}`, response);
    const { ok, result } = response;
    if (!ok) return SendResponse.badRequestError(res, response);
    if (!result) {
      return SendResponse.badRequestError(res, {
        ok: false,
        error: new Error('User record not found')
      });
    }
    return SendResponse.success(res, response);
  }

  static async updateUser(req, res) {
    const allowedProperties = {
      $set: ['email', 'name']
    };
    req.params.id = req.user._id;
    return super.updateEntity(req, res, { allowedProperties });
  }
};
