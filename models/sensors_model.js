/**
 * Created by joseant on 05/05/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.schema = new Schema({
    code: { type: String, unique: true},
    value: Number,
    description: String,
    timestamp: Date,
    protocol: String,
    uri: String
});

module.exports.model = mongoose.model('Sensor', this.schema);