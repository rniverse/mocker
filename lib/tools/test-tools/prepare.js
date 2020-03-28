const mongoose = require('mongoose');

const Prepare = {
  User: {
    addTestUser: async () => {
      const User = mongoose.model('User');
      const username = Math.random().toString(36).substring(10);
      const user = {
        username,
        email: `${username}@pm.com`,
        firstname: username,
        password: 'something'
      };
      return User.create(user);
    }
  }
};

module.exports = Prepare;
