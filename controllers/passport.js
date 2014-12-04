var passport = require('passport'),
    RedditStrategy = require('passport-reddit').Strategy,
    redditConfig = require('../config/redditConfig.js');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

if (!redditConfig) {
    throw "This app requires '../config/redditConfig.js' to return redditconfig.REDDIT_CONSUMER_KEY, .REDDIT_CONSUMER_SECRET, and .CALLBACK_URL!";
}

passport.use(new RedditStrategy({
    clientID: redditConfig.REDDIT_CONSUMER_KEY,
    clientSecret: redditConfig.REDDIT_CONSUMER_SECRET,
    callbackURL: redditConfig.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {

        });
    }));
    
module.exports = passport;