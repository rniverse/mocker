const { SendResponse } = require('root/utils');

module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    return SendResponse.notAcceptableError(res, {
      ok: false,
      error: new Error('User authorization present')
    });
  }
  return next();
};
