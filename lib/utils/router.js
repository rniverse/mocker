module.exports = () => {
  const router = require('express').Router({
    mergeParams: true
  });
  return router;
};
