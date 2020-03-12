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
  return response;
};
module.exports = class SendResponse {
  static success(res, data) {
    const result = transform(data);
    res.send(result, 200);
  }

  static created(res, data) {
    const result = transform(data);
    res.send(result, 201);
  }

  static badRequestError(res, data) {
    const result = transform(data);
    res.send(result, 400);
  }

  static unauthorizedRequestError(res, data) {
    const result = transform(data);
    res.send(result, 401);
  }

  static forbiddenRequestError(res, data) {
    const result = transform(data);
    res.send(result, 403);
  }

  static notFoundError(res, data) {
    const result = transform(data);
    res.send(result, 404);
  }

  static notAcceptableError(res, data) {
    const result = transform(data);
    res.send(result, 406);
  }
};
