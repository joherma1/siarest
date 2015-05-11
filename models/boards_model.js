/**
 * Created by jose on 13/04/15.
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;
var Sensor =  require('./sensors_model');

var BoardSchema = new Schema({
    id: { type: String, unique: true},
    port: String,
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
    var board = new BoardModel({id:1});
    var sensor1 = new Sensor.model({code: 22});
    var sensor2 = new Sensor.model({code: 23, value: 4.5, description: "Test Sensor"});

    //Add item to the array
    board.sensors.push(sensor1);
    board.sensors.push(sensor2);
    board.save(function (err) {
        if (err)
            console.error('Error initializing', err);
        else
            console.log('Success: Database initialized');
    });
};


module.exports.boardModel = mongoose.model('Board', BoardSchema);