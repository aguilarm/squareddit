var passport = require('passport'),
    RedditStrategy = require('passport-reddit').Strategy,
    secret = require('../config/secret.js');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

if (!secret) {
    throw "This app requires '../config/secret.js' to return secret.REDDIT_CONSUMER_KEY, .REDDIT_CONSUMER_SECRET, and .CALLBACK_URL!";
}

passport.use(new RedditStrategy({
    clientID: secret.REDDIT_CONSUMER_KEY,
    clientSecret: secret.REDDIT_CONSUMER_SECRET,
    callbackURL: secret.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            console.log(profile);
            return done(null, profile);
        });
    }));
    
module.exports = passport;