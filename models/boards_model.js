/**
 * Created by jose on 13/04/15.
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;
var Sensor =  require('./sensors_model');

var BoardSchema = new Schema({
    id: { type: String, unique: true},
    protocol: String,
    uri: String,
    description: String,
    sensors: [Sensor.schema]
});


module.exports.initialize = function(){
    //Generate the model
    var BoardModel = mongoose.model('Board', BoardSchema);

    BoardModel.remove({}, function(err) {
        if(err)
            console.error("Error deleting Boards", err);
    });

    //Create the instance
    var board = new BoardModel({id:1, protocol: "USB", uri: "/dev/ttyACM0"});
    var sensor1 = new Sensor.model({code: '282ddbaf020000b0', value: 4.5,
        description: "Test Sensor", timestamp: Date.now()});

    //Add item to the array
    board.sensors.push(sensor1);
    board.save(function (err) {
        if (err)
            console.error('Error initializing', err);
        else
            console.log('Success: Database initialized');
    });
};


module.exports.boardModel = mongoose.model('Board', BoardSchema);

module.exports.saveValue = function(board, sensor, value){
    var BoardModel = mongoose.model('Board', BoardSchema);
    var query = BoardModel.findOne().where('_id',board._id);
    query.exec(function(err, board){
        var sensormodel = board.sensors.id(sensor.id);
        sensormodel.value = value;
        sensormodel.timestamp = Date.now();
        board.save(function(err){
            if(err)
                console.error('Error saving the value ', err);
        });
    });
};
