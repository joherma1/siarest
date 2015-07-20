var express = require('express');
var router = express.Router();
YAML = require('yamljs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/swagger', function(req, res, next) {
    if(req.query.url == null)
        res.redirect('/swagger?url=' + req.protocol + '://' + req.get('host') + '/swagger.yaml');
    else{
        var path = __dirname + '/../node_modules/swagger-ui/dist/index.html';
        res.render(path);
    }
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

    var nativeObject = YAML.load(options.root + 'swagger.yaml');
    res.json(nativeObject);
});

module.exports = router;
