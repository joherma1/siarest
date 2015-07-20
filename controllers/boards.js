/**
 * Created by jose on 13/04/15.
 */
var express = require('express');
var router = express.Router();

var Board = require('../models/boards_model.js').boardModel;

/* GET /boards listing */
router.get('/', function(req, res, next){
    Board.find({}).select('_id id port description').exec(function(err, boards){
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
    var options = {new:true};
        Board.findByIdAndUpdate(req.params.id, req.body, options, function(err, update){
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


/* GET /board/:id/sensors all sensors*/
router.get('/:id/sensors', function(req, res, next){
    Board.findById(req.params.id).select('sensors').exec(function(err, board){
        if (err)
            return next(err);
        if(board)
            res.json(board.sensors);
        else
            return next(err);

    });
});

/*GET /board/:boardId/sensors/:sensorID*/
router.get('/:boardId/sensors/:sensorId', function (req, res, next) {
    Board.find({}).where({"_id": req.params.boardId}).exec(function (err, board) {
        if (err)
            return next(err);
        if (board) {
            var sensor = board[0].sensors.id(req.params.sensorId);
            res.json(sensor);
        }
        else
            return next(err);
    });
});

/*GET /board/:boardId/sensors/:sensorID/value */
/*Retrieve just the value */
router.get('/:boardId/sensors/:sensorId/value', function (req, res, next) {
    Board.find({}).where({"_id": req.params.boardId}).exec(function (err, board) {
        if (err)
            return next(err);
        if (board) {
            var sensor = board[0].sensors.id(req.params.sensorId);
            var response = {"value": sensor.value};
            res.json(response);
        }
        else
            return next(err);
    });
});

module.exports = router;