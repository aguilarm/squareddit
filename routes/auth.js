var express = require('express'),
    app = express();

app.get('/login', function (req, res, next) {
    console.log(req);
    res.send("Check console");
});

app.get('/user', function (req, res, next) {
    res.send('potato');
});

app.get('/*', function (req, res, next) {
    res.send("Hello world");
});

module.exports = app;