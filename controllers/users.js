var express = require('express');
var User = require('../models/user_model.js');
var authController = require('./auth');

var router = express.Router();

/* GET users listing. */
router.get('/', authController.isAuthenticated, function(req, res, next) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
});

/* POST user */
router.post('/',function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function (err) {
    if (err)
      res.send(err);

    res.status(201).json(user);
  })
});

module.exports = router;
