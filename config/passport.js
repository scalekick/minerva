var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userObjClass = require('../public/javascripts/helper/user.js');
var userData = require('../public/javascripts/data/user.js');

passport.initialize();

passport.use(new LocalStrategy(
  function(username, password, done) {
    userData.getUser(username, function (err, user) {

      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      var userObj = new userObjClass(user);

      if (!userObj.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
