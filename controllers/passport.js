var express = require('express'),
    passport = require('passport'),
    util = require('util'),
    crypto = require('crypto'),
    RedditStrategy = require('passport-reddit').Strategy,
    redditConfig = require('config/redditConfig.js');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
   
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