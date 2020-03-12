const mongoose = require('mongoose');
const config = require('config');
const {
  handlePromise,
  Logger,
  regex
} = require('root/utils');
const { MongooseBaseMethods, constants } = require('./utils');

const { USER: MODEL_NAME } = constants.MODEL;
const BaseMethods = MongooseBaseMethods({ MODEL_NAME });

const { Schema } = mongoose;

const logger = Logger.child({ service: 'USR_MDL' });
logger.trace('User model initialized');

const { RESET_PASSWORD_EXPIRES_IN_MINUTES } = config;

const VerficationSchema = new Schema({
  code: { type: Schema.Types.String },
  expiresAt: { type: Schema.Types.Date }
}, { _id: false });

const UserSchema = new Schema({
  name: {
    type: Schema.Types.String,
    trim: true,
    required: true,
    validate: {
      validator: regex.person_name,
      message: 'invalid name'
    }
  },
  email: {
    type: Schema.Types.String,
    trim: true,
    required: true,
    validate: {
      validator: regex.email,
      message: 'invalid email'
    }
  },
  username: {
    type: Schema.Types.String,
    trim: true,
    validate: {
      validator: regex.handler,
      message: 'invalid handler'
    }
  },
  password: { type: Schema.Types.String, specs: { sensitive: true } },
  verify: { type: VerficationSchema, default: undefined, specs: { sensitive: true } },
  reset: { type: VerficationSchema, default: undefined, specs: { sensitive: true } }
}, {
  timestamps: true,
  collection: constants.COLLECTION[MODEL_NAME],
  versionKey: false
});

UserSchema.index({ name: 1 }, { background: true });
UserSchema.index({ updatedAt: 1 }, { background: true });
UserSchema.index({ email: 1 }, { background: true, unique: true });
UserSchema.index({ username: 1 }, { background: true, sparse: true, unique: true });

class UserMethods extends BaseMethods {
  static async signup(doc) {
    const User = mongoose.model('User');
    const user = new User(doc);
    const { ok, error } = await handlePromise(user.validate());
    if (!ok) {
      throw error;
    }
    return user.save();
  }

  static async signin(info) {
    const { password } = info;
    const select = {
      name: 1,
      username: 1,
      password: 1
    };
    const User = mongoose.model('User');
    const {
      ok,
      result: authUser,
      error
    } = await handlePromise(User.getUser(info, select));
    if (!ok) {
      throw error;
    }
    if (!authUser) {
      throw new Error('User record not found!');
    }
    if (authUser.password !== password) {
      throw new Error('Invalid credentials');
    }
    return authUser;
  }

  static async getUser(doc, select) {
    const { email, username } = doc || {};
    const query = {};
    const projection = select || {};
    if (email) {
      query.email = email;
    } else if (username) {
      const key = username.includes('@') ? 'email' : 'username';
      query[key] = username;
    } else {
      throw new Error('Invalid input');
    }
    const User = mongoose.model('User');
    return User.findOne(query, projection).lean(true);
  }

  static async changePassword(doc) {
    const { oldPassword, newPassword, user } = doc || {};
    const User = mongoose.model('User');
    return User.findOneAndUpdate({
      _id: user,
      password: oldPassword
    }, {
      $set: {
        password: newPassword
      }
    }, { new: true })
      .lean();
  }

  static async forgotPassword(doc) {
    const { username, code } = doc;
    const queryKey = username.includes('@') ? 'email' : 'username';
    const User = mongoose.model('User');
    const expiresAt = new Date(Date.now() + RESET_PASSWORD_EXPIRES_IN_MINUTES * 1000);
    return User.findOneAndUpdate({ [queryKey]: username }, {
      $set: {
        reset: {
          code,
          expiresAt
        }
      }
    }).lean();
  }

  static async resetPassword(doc) {
    const {
      code,
      password,
      username
    } = doc;
    const queryKey = username.includes('@') ? 'email' : 'username';
    const User = mongoose.model('User');
    return User.findOneAndUpdate({
      [queryKey]: username,
      'reset.code': code,
      'reset.expiresAt': { $lte: new Date() }
    }, {
      $set: {
        password
      },
      $unset: {
        reset: ''
      }
    }).lean();
  }

  static verifyUser() {
    // TODO: do almost same as forgot password but with verify
  }

  static confirmUserVerification() {
    // TODO: do almost same as reset password but with verify
  }
}

UserSchema.loadClass(UserMethods);

const UserModel = mongoose.model(MODEL_NAME, UserSchema);

module.exports = UserModel;
