/**
 * Created by jose on 13/04/15.
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;
var Sensor = require('./sensors_model');

var BoardSchema = new Schema({
    id: {type: String, unique: true},
    protocol: String,
    uri: String,
    description: String,
    sensors: [Sensor.schema]
});


module.exports.initialize = function (callback) {
    //Generate the model
    var BoardModel = mongoose.model('Board', BoardSchema);

    BoardModel.remove({}, function (err) {
        if (err) {
            console.error("Error deleting Boards", err);
            callback(err);
        }
    });

    //Create the instance
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
        if (callback)
            callback(err);
    });
};


module.exports.boardModel = mongoose.model('Board', BoardSchema);

module.exports.saveValue = function (board, sensor, value, callback) {
    var BoardModel = mongoose.model('Board', BoardSchema);
    var query = BoardModel.findOne().where('_id', board._id);
    query.exec(function (err, board) {
        var sensormodel = board.sensors.id(sensor.id);
        sensormodel.value = value;
        sensormodel.timestamp = Date.now();
        board.save(function (err) {
            if (err) {
                console.error('Error saving the value ', err);
                callback(error);
            } else {
                callback();
            }
        });
    });
};

module.exports.findSensorByBoardAndId = function (boardId, sensorId, callback) {
    //Native driver
    //db.boards.find({$and: [{id:"2"}, {"sensors.code": "282ddbaf020000b0"}]},{"sensors":1});
    //Using mongoose query
    this.boardModel.find({}).where('id').equals(boardId)
        .where('sensors.code').equals(sensorId)
        .select('sensors')
        .exec(function (err, results) {
            if (err)
                callback(err);
            if (results.length == 1 && results[0].sensors.length == 1) {
                callback(null, results[0].sensors[0]);
            }
            else
                callback(err, null);
        });
};
