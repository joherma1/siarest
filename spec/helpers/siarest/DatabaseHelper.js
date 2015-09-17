/**
 * Created by joseant on 15/09/15.
 * Executed before the specs
 */
var config = require('../../../config/properties-test');
var Sensor = require('../../../models/sensors_model');
var mongoose = require("mongoose");
var BoardSchema = require("../../../models/boards_model").boardModel;

beforeEach(function (done) {
    mongoose.connect(config.db.mongodb, function (err) {
        if (err) {
            console.error('[Database] Connection error', err);
        }
        else {
            mongoose.connection.db.dropDatabase(function (err, result) {
                if (err) {
                    console.error('[Database] Error droping database', err);
                }
                else {
                    //Create the instance
                    var BoardModel = mongoose.model('Board', BoardSchema);
                    var board = new BoardModel({id: 1, protocol: "USB", uri: "/dev/cu.usbmodem1411"});
                    var sensor1 = new Sensor.model({
                        code: '282ddbaf020000b0', value: 4.5,
                        description: "Test Sensor", timestamp: Date.now()
                    });

                    //Add item to the array
                    board.sensors.push(sensor1);
                    board.save(function (err) {
                        if (err)
                            console.error('[Database] Error initializing', err);
                        else
                            done();
                    });
                }
            });
        }
    });
});

afterEach(function (done) {
    mongoose.disconnect();
    done();
});

afterAll(function (done) {
    mongoose.connect(config.db.mongodb, function () {
        mongoose.connection.db.dropDatabase();
        done();
    });
});