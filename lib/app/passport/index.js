const passport = require('passport');

const {
  LocalStrategy,
  JWTStrategy
} = require('./strategies');

passport.use(LocalStrategy);
passport.use(JWTStrategy);
