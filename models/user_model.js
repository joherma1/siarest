// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
//TODO create property for admin password
//bcrypt.hashSync("sia_password");
var adminPassword = "$2a$10$lfZVtiKEpaRgDnfXaA6mqufwaSm0PGk/PGab17okTg9GXwH3nVF6i";

// Define our user schema
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Execute before each user.save() call
// If the password has changed, store it in md5
UserSchema.pre('save', function (callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();
    // or if we are modifying admin password (password non writable)
    if (user.username == "admin") {
        user.password = adminPassword;
        return callback();
    }

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

// Add function to the model to verify password
UserSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// Export the Mongoose model
module.exports.userModel = mongoose.model('User', UserSchema);

module.exports.initialize = function (callback) {
    var userModel = mongoose.model('User', UserSchema);

    userModel.remove({}, function (err) {
        if (err) {
            console.error("Error deleting Boards", err);
            callback(err);
        }

        var userAdmin = new userModel({username: "admin", password: adminPassword});
        userAdmin.save(function (err) {
            if (err)
                console.error('[Database] Error initializing user admin', err);
            if (callback)
                callback(err);
        });
    });
};