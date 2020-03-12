module.exports = (promise) => promise
  .then((result) => ({ ok: true, result }))
  .catch((err) => ({ ok: false, error: err }));
