const mongoose = require('mongoose');
const { postValidate, removeSensitive } = require('./plugins');

mongoose.plugin(postValidate);
mongoose.plugin(removeSensitive);

const Counter = require('./counter');
const User = require('./user');
const Note = require('./note');

module.exports = {
  Counter,
  User,
  Note
};
