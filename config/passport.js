const LocalStrategy = require('passport-local').Strategy;
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

function initialize(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      catchAsync(async (email, password, done) => {
        await User.findOne({ email }, async (err, user) => {
          if (err) {
            return done(err);
          }

          if (!user) {
            return done(null, false, { message: `Invalid Email ${email}` });
          }
          if (!user.active) {
            return done(null, false, { message: 'User is Deactivated' });
          }
          if (!(await user.correctPassword(password, user.password))) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, user);
        }).select('+password');
      })
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = initialize;
