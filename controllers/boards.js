/**
 * Created by jose on 13/04/15.
 */
var express = require('express');
var router = express.Router();
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var boardModel = require("../models/boards_model");

var Board = require('../models/boards_model.js').boardModel;

/* GET /boards listing */
router.get('/', function (req, res, next) {
    Board.find({}).select('_id id port description').exec(function (err, boards) {
        if (err)
            return next(err);
        res.json(boards);
    });
});

/* GET /boards/:id */
router.get('/:id', function (req, res, next) {
    Board.findById(req.params.id, function (err, board) {
        if (err)
            return next(err);
        res.json(board);
    })
});

/* POST /boards */
router.post('/', function (req, res, next) {
    Board.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /boards/:id */
router.put('/:id', function (req, res, next) {
    var options = {new: true};
    Board.findByIdAndUpdate(req.params.id, req.body, options, function (err, update) {
        if (err)
            return next(err);
        res.json(update);
    });
});

/* DELETE /boards/:id */
router.delete('/:id', function (req, res, next) {
    Board.findByIdAndRemove(req.params.id, req.body, function (err, del) {
        if (err)
            return next(err);
        res.json(del);
    });
});


/* GET /board/:id/sensors all sensors*/
router.get('/:id/sensors', function (req, res, next) {
    Board.findById(req.params.id).select('sensors').exec(function (err, board) {
        if (err)
            return next(err);
        if (board)
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
                if ((Date.now() - sensor.timestamp) / 1000 < 60) {
                    var response = {"value": sensor.value};
                    res.json(response);
                } else {
                    if (sensor.protocol === "USB") {
                        var serialPort = new SerialPort(sensor.uri, {
                            baudrate: 9600,
                            parser: serialport.parsers.readline(String.fromCharCode(4)) //AlReg EOT code
                        });
                        serialPort.on("open", function (error) {
                                if (error) {
                                    console.error("Failed to open: " + error);
                                } else {
                                    console.log("[ino] Connection opened with: " + board[0].id);
                                    var messageByte = hexToByte("6d" + sensor.code);//0x6D m select sensor
                                    console.log("[ino] Select sensor: 6d " + sensor.code + " to board " + board[0].id);
                                    serialPort.write(messageByte, function () {
                                        serialPort.drain(function (error, results) {
                                                if (error) {
                                                    console.error("error writing " + error);
                                                } else {
                                                    serialPort.once('data', function (data) { //wait only once
                                                        if (data != 1)
                                                            console.error("Unable to select the sensor");
                                                        else {
                                                            //get value
                                                            console.log("[ino] Get value: 6e " + sensor.code + " to board " + board[0].id);
                                                            serialPort.write(new Buffer("6e", 'hex'), function () {
                                                                serialPort.drain(function (error, results) {
                                                                    serialPort.once('data', function (data) {
                                                                        var response = {"value": parseFloat(data)};
                                                                        boardModel.saveValue(board[0], sensor, data);
                                                                        res.json(response);
                                                                        serialPort.close(function (error) {
                                                                            if (error)
                                                                                console.error("Error closing the port: " + error);
                                                                            else
                                                                                console.log("[ino] Connection closed with " + board[0].id);
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        )
                                        ;
                                    });
                                }
                            }
                        )
                        ;
                    }
                }
            }
            else
                return next(err);
        }
    )
    ;
});

function hexToByte(input) {
    return new Buffer(input, 'hex');
    //var result = [];
    //for(var i = 0; i < input.length; i=i+2){
    //    result.push(new Buffer(parseInt(input.substring(i,i+2),16)));
    //}
    //return result;
}

module.exports = router;