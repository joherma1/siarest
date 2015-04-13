/**
 * Created by jose on 13/04/15.
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var BoardSchema = new Schema({
    id: { type: String, unique: true},
    port: String,
    description: String
});

module.exports = mongoose.model('Board', BoardSchema);