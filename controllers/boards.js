/**
 * Created by jose on 13/04/15.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Board = require('../models/boards_model.js');

/* GET /boards listing */
router.get('/', function(req, res, next){
    Board.find(function(err, boards){
        if(err)
            return next(err);
        res.json(boards);
    });
});

module.exports = router;