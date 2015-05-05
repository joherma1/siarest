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

/* GET /boards/:id */
router.get('/:id',function(req, res, next){
   Board.findById(req.params.id, function(err, board){
       if(err)
         return next(err);
       res.json(board);
   })
});

/* POST /boards */
router.post('/', function(req, res, next) {
    Board.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /boards/:id */
router.put('/:id', function(req, res, next) {
    Board.findByIdAndUpdate(req.params.id, req.body, function(err, update){
        if(err)
            return next(err);
        res.json(update);
    });
});

/* DELETE /boards/:id */
router.delete('/:id', function(req, res, next){
   Board.findByIdAndRemove(req.params.id, req.body, function(err, del){
       if (err)
        return next(err);
       res.json(del);
    });
});


module.exports = router;