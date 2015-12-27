// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user_model');

//Passport components:
//Strategies config
//Middleware
//Session

passport.use(new BasicStrategy(
    // Verify callback: find the user that possesses a set of credentials
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }

            // No user found with that username
            if (!user) { return done(null, false, { message: 'Incorrect username.' }); }

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return done(err); }

                // Password did not match
                if (!isMatch) { return done(null, false, { message: 'Incorrect password.' }); }

                // Success
                return done(null, user);
            });
        });
    }
));

// Export the authecticar method to include it in the middleware. With Session off
exports.isAuthenticated = passport.authenticate('basic', { session : false });