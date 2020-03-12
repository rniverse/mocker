const mongoose = require('mongoose');
const { postValidate, removeSensitive } = require('./plugins');

mongoose.plugin(postValidate);
mongoose.plugin(removeSensitive);

const User = require('./user');
const Note = require('./note');

module.exports = {
  User,
  Note
};
