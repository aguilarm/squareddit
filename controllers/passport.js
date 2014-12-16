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

var User = Users.model('User');

passport.use(new RedditStrategy({
    clientID: secret.REDDIT_CONSUMER_KEY,
    clientSecret: secret.REDDIT_CONSUMER_SECRET,
    callbackURL: secret.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            console.log(profile);
            
            User.findOne({ uid: 'profile.id' }, 
                function(err, user) {
                    if (err) { console.log(err) }
                    if (user) { console.log('user found!') }
                    
                    console.log('user not found, creating entry');
                    
                    var thisUser = new User();
                    thisUser.uid = profile.id;
                    var t = [
                        { type: 'access', token: accessToken },
                        { type: 'refresh', token: refreshToken }
                    ];
                    thisUser.tokens.push(t);
                    
                    return done(null, thisUser);
                });
            //return done(null, profile);
        });
    }));
    
module.exports = passport;