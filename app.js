var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config/properties');

var passport = require('passport');

//Database mongod --dbpath ./data/
var mongoose = require('mongoose');// mongoose for mongodb
mongoose.connect(config.db.mongodb, function(err) {
  if(err) {
    console.error('[Database] Connection error', err);
  } else {
    console.log('[Database] Connection successful');
  }
});
var Board = require('./models/boards_model.js');
var User = require('./models/user_model.js');

var routes = require('./controllers/index');
var users = require('./controllers/users');
var boards = require('./controllers/boards');

var app = express(); // create our app w/ express

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//to render html
app.engine('html', require('ejs').renderFile);

//MIDDLEWARES
// uncomment after placing your favicon in /static
//app.use(favicon(__dirname + '/static/favicon.ico'));
app.use(logger('dev')); //morgan middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

// Enable CORS to allow read the swagger.yaml
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Use the passport package in our application
app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);
app.use('/boards', boards);
// Swagger 
app.use(express.static(path.join(__dirname, 'node_modules/swagger-ui/dist')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

Board.initialize();
User.initialize();
module.exports = app;
