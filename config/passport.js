var passport = require('passport'),
    RedditStrategy = require('passport-reddit').Strategy,
    Users = require('../models/Users'),
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