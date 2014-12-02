var express = require('express'),
    router = express.Router();

router.get('/login', function (req, res, next) {
    console.log(req);
    res.send("Check console"); 
});

router.get('/*', function (req, res, next) {
    res.send("Hello world");
});

module.exports = router;