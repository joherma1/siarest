/**
 * Created by jose on 13/04/15.
 */
var express = require('express');
var router = express.Router();
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var boardModel = require("../models/boards_model");

var Board = require('../models/boards_model.js').boardModel;
var BoardDAO = require('../models/boards_model.js');

/* GET /boards listing */
router.get('/', function (req, res, next) {
    Board.find({}).select('_id id protocol uri description').exec(function (err, boards) {
        if (err)
            return next(err);
        res.json(boards);
    });
});

/* GET /boards/:id */
router.get('/:id', function (req, res, next) {
    //Use the mongo native driver
    Board.find({id: req.params.id}, function (err, board) {
        if (err)
            return next(err);
        if (board[0] == null)
            res.status(404).send("Board not found");
        else
            res.json(board[0]);
    });
});

/* POST /boards */
router.post('/', function (req, res, next) {
    if (req && req.body && req.body.id) {
        Board.create(req.body, function (err, post) {
            if (err) return next(err);
            res.status(201).json(post);
        });
    } else {
        res.status(400).send();
    }
});

/* PUT /boards/:id */
router.put('/:id', function (req, res, next) {
    var conditions = {id: req.params.id};
    var options = {new: true};
    Board.update(conditions, req.body, options, function (err, numAffected) {
        if (err)
            return next(err);
        res.json(numAffected);
    });
});

/* DELETE /boards/:id */
router.delete('/:id', function (req, res, next) {
    Board.remove({id: req.params.id}, function (err, del) {
        if (err)
            return next(err);
        res.json(del);
    });
});


/* GET /board/:id/sensors all sensors*/
router.get('/:id/sensors', function (req, res, next) {
    Board.find({id: req.params.id}, function (err, board) {
        if (err)
            return next(err);
        if (board && board.length > 0)
            res.json(board[0].sensors);
        else
            return next(err);
    });
});

/*GET /board/:boardId/sensors/:sensorID*/
router.get('/:boardId/sensors/:sensorId', function (req, res, next) {
    BoardDAO.findSensorByBoardAndId(req.params.boardId, req.params.sensorId, function (err, result) {
        if (err)
            next(err);
        else
            res.json(result);
    });
});

/*GET /board/:boardId/sensors/:sensorID/value */
/*Retrieve just the value */
router.get('/:boardId/sensors/:sensorId/value', function (req, res, next) {
    Board.find({}).where('id').equals(req.params.boardId)
        .where('sensors.code').equals(req.params.sensorId)
        .exec(function (err, board) {
            if (err)
                return next(err);
            if (board && board.length > 0) {
                // --------------------
                // TODO
                // Promisify
                // --------------------
                var sensor = board[0].sensors[0];
                if ((Date.now() - sensor.timestamp) / 1000 < 60) {
                    var response = {"value": sensor.value};
                    res.json(response);
                } else {
                    if (board[0].protocol === "USB") {
                        var serialPort = new SerialPort(board[0].uri, {
                            baudrate: 9600,
                            parser: serialport.parsers.readline(String.fromCharCode(4)) //AlReg EOT code, end of command
                        });
                        serialPort.on("open", function (error) {
                            if (error) {
                                console.error("[ino] Failed to open: " + error);
                            } else {
                                console.log("[ino] Connection opened with board " + board[0].id);
                                // Message sent to arduino in binary, as Bytes
                                var messageByte = new Buffer("6d" + sensor.code, 'hex');//0x6D m select sensor
                                console.log("[ino] Select sensor: 6d " + sensor.code + " from board " + board[0].id);
                                serialPort.write(messageByte, function () {
                                    serialPort.drain(function (error, results) {
                                            if (error) {
                                                console.error("error writing " + error);
                                            } else {
                                                serialPort.once('data', function (data) { //wait only once
                                                    if (data != 1)
                                                        console.error("Unable to select the sensor");
                                                    else {
                                                        console.log("[ino] Get value: 6e " + sensor.code + " from board " + board[0].id);
                                                        serialPort.write(new Buffer("6e", 'hex'), function () {
                                                            serialPort.drain(function (error, results) {
                                                                serialPort.once('data', function (data) {
                                                                    var response = {"value": parseFloat(data)};
                                                                    boardModel.saveValue(board[0], sensor, data, function (err) {
                                                                        if (err) {
                                                                            res.status(500).send({error: "[DB] " + err});
                                                                        } else {
                                                                            res.json(response);
                                                                            serialPort.close(function (error) {
                                                                                if (error)
                                                                                    console.error("Error closing the port: " + error);
                                                                                else
                                                                                    console.log("[ino] Connection closed with board" + board[0].id);
                                                                            });
                                                                        }
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
                        });
                        serialPort.on("error", function (err) {
                            res.status(500).send({error: "[ino] " + err});
                        });
                    }
                    else {
                        res.status(404).send({error: "Invalid sensor"});
                    }
                }
            }
            else
                return next(err);
        }
    )
    ;
});

module.exports = router;