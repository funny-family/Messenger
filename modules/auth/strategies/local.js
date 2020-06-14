const LocalStrategy = require('passport-local').Strategy;
const User = require('../../user/models/User');

module.exports = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, function (email, password, done) {
  User.findOne({ email }, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, 'User not found!');
    if (!user.passwordCheck(password)) return done(null, false, 'Incorrect password!');
    return done(null, false);
  });
});