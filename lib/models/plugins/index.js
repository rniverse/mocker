const postValidate = require('./post-validate');
const removeSensitive = require('./remove-sensitive');
const addOwner = require('./add-owner');

module.exports = {
  postValidate,
  removeSensitive,
  addOwner
};
