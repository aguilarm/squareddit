var express = require('express'),
    path = require('path'),
    swig = require('swig'),
    app = express();
    
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', (__dirname, 'views'));

app.use(express.static(__dirname + '/public'));


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
    console.log(process.env.IP);
    if (app.get('env') === 'development') {
        console.log('RUNNING IN DEV MODE');
    }
});