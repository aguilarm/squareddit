var passport = require('passport');
var RedditStrategy = require('passport-reddit').Strategy;
var Users = require('../models/Users');

// throw a descriptive error if lacking secret.js
try {
    var secret = require('./secret.js');
} catch (err) {
    console.log("This app requires '../config/secret.js' to return a secret object with REDDIT_CONSUMER_KEY, " +
      "REDDIT_CONSUMER_SECRET, and CALLBACK_URL params!");
}

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

var Account = Users.model('User');

passport.use(new RedditStrategy({
    clientID: secret.REDDIT_CONSUMER_KEY,
    clientSecret: secret.REDDIT_CONSUMER_SECRET,
    callbackURL: secret.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            Account.findOne({ uid: 'profile.id' }, 
                function(err, account) {
                    if (err) { console.log(err) }
                    if (account) { console.log('account found!') }
                    
                    console.log('account not found, creating entry');
                    
                    account = new Account();
                    account.uid = profile.id;
                    var t = [
                        { type: 'access', token: accessToken },
                        { type: 'refresh', token: refreshToken }
                    ];
                    account.tokens.push(t);
                    
                });
            return done(null, profile);
        });
}));

    
module.exports = passport;