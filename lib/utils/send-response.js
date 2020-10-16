const Logger = require('./logger');

const logger = Logger.child({ service: 'SND_RSPNS' });
const errorToJSON = (error) => {
  if (!error) return {};
  const alt = {};
  if (typeof error !== 'object' || Array.isArray(error)) return error;
  Object.getOwnPropertyNames(error).forEach((key) => {
    alt[key] = error[key];
  }, error);
  return alt;
};
const transform = (data) => {
  const {
    ok,
    result,
    error,
    meta
  } = data || {};
  const response = {};
  if (!ok) {
    Object.assign(response, {
      errors: Array.isArray(error)
        ? error
        : [error]
    });
    response.errors = response.errors.map(errorToJSON);
  } else {
    Object.assign(response, {
      data: result
    });
  }
  if (meta) {
    Object.assign(response, { meta });
  }
  if (!ok) {
    logger.error(response);
  }
  return response;
};
module.exports = class SendResponse {
  static success(res, data) {
    const result = transform(data);
    res.status(200).send(result).end();
  }

  static created(res, data) {
    const result = transform(data);
    res.status(201).send(result).end();
  }

  static badRequestError(res, data) {
    const result = transform(data);
    res.status(400).send(result).end();
  }

  static unauthorizedRequestError(res, data) {
    const result = transform(data);
    res.status(401).send(result).end();
  }

  static forbiddenRequestError(res, data) {
    const result = transform(data);
    res.status(403).send(result).end();
  }

  static notFoundError(res, data) {
    const result = transform(data);
    res.status(404).send(result).end();
  }

  static notAcceptableError(res, data) {
    const result = transform(data);
    res.status(406).send(result).end();
  }
};
