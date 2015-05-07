var express = require('express'),
    morgan = require('morgan'),
    swig = require('swig'),
    app = express(),
    mongoose = require('mongoose'),
    userRoute = require('./nodeapp/routes/redditUser'),
    redditPassport = require('./nodeapp/controllers/passport');

app.use(morgan('dev'));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', (__dirname + '/app/views'));

mongoose.connect('mongodb://127.0.0.1/sqreddit', function (err, db) {
    if (!err)
        console.log('Connected to MongoDB!');
    else
        console.log(err);
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


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening at ' + process.env.IP + ':' + app.get('port'));
    if (app.get('env') === 'development') {
        console.log('Using the ' + app.get('env') + ' environment.');
    }
});