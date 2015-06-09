var express = require('express');
var router = express.Router();
YAML = require('yamljs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/swagger', function(req, res, next) {
    var olddirname = __dirname;
    __dirname = __dirname + '/../static/swagger-ui/dist/';
    var path = __dirname + 'index.html';
    res.render(path);
    __dirname = olddirname;
});

router.get('/swagger.yaml', function(req, res, next) {

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

router.get('/swagger.json', function(req, res, next) {

    var options = {
        root: __dirname + '/../views/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    //res.sendFile('swagger.json', options, function (err) {
    //    if (err) {
    //        console.log(err);
    //        res.status(err.status).end();
    //    }
    //    else {
    //        console.log('swagger.yaml');
    //    }
    //});

    var nativeObject = YAML.load(options.root + 'swagger.yaml');
    res.json(nativeObject);
});

module.exports = router;
