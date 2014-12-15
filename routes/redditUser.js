var express = require('express'),
    passport = require('passport'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    crypto = require('crypto'),
    app = express(),
    secret = require('../config/secret.js');
    
app.use(session({   
    secret: secret.sessionSecret,
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({
    extended: true
}));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next;
    res.redirect('/');
}

app.get('/account', ensureAuthenticated, function (req, res, next) {
    res.send(req.user);
});

app.get('/reddit', function (req, res, next) {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
        state: req.session.state,
    })(req, res, next);
});

app.get('/reddit/callback', function (req, res, next) {
    if (req.query.state == req.session.state) {
        passport.authenticate('reddit', {
            successRedirect: '/',
            failureRedirect: '/'
        })(req,res,next);
    } else {
        next( new Error(403) );
    }
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = app;