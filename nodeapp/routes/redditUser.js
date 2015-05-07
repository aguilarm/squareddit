var express = require('express'),
    passport = require('passport'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    request = require('request'),
    crypto = require('crypto'),
    app = express(),
    secret = require('./secret.js');
    
app.use(session({   
    secret: secret.sessionSecret,
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

app.get('/account', ensureAuthenticated, function (req, res, next) {
    res.send(req.user);
});

app.get('/reddit', function (req, res, next) {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
        state: req.session.state,
        scope: 'history,identity,mysubreddits,submit,read,vote'
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

app.post('/vote', ensureAuthenticated, function (req, res) {
    var postId = req.body.id,
        direction = req.body.dir;
    
    passport.authenticate('reddit'),
    function (req, res) {
        console.log(req.account);
    };
    
    console.log('vote');
    console.log(postId);
    console.log(req.account);
});

module.exports = app;