var express = require('express'),
    passport = require('passport'),
    session = require('express-session'),
    app = express();

app.use(session({   
    secret: 'potatosalad',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

//util function from passport-reddit example repo
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next;
    res.redirect('auth/login');
}

app.get('/account', ensureAuthenticated, function (req, res, next) {
    var user = req.body.user,
        pass = req.body.pass,
        rem = req.body.rem;
    
    
    
        
    
    res.send("Check console");
});

app.get('/user', function (req, res, next) {
    res.send('potato');
});

app.get('/*', function (req, res, next) {
    res.send("Hello world");
});

module.exports = app;