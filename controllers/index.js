var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/swagger', function(req, res, next) {
    res.render('swagger/index.html');
});

router.get('/swagger.json', function(req, res, next) {

    var options = {
        root: __dirname + '/../views/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile('swagger.yaml', options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('swagger.yaml');
        }
    });
});
module.exports = router;
