var express = require('express');
var morgan = require('morgan');
var swig = require('swig');
var app = express();
var mongoose = require('mongoose');
var redditUserRoute = require('./nodeapp/routes/redditUser');
var redditPassport = require('./nodeapp/config/passport');

app.use(morgan('dev'));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', (__dirname + '/nodeapp/views'));

mongoose.connect('secret.USERS_DB', function (err, db) {
    if (!err)
        console.log('Connected to USERS_DB!');
    else
        throw err;
});

app.use(redditPassport.initialize());
app.use(redditPassport.session());

app.use('/user', redditUserRoute);

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

//probably shouldnt default to 80, but #TODO
app.set('port', process.env.PORT || 80);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening at ' + process.env.IP + ':' + app.get('port'));
    if (app.get('env') === 'development') {
        console.log('Using the ' + app.get('env') + ' environment.');
    }
});