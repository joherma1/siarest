/**
 * Created by joseant on 15/09/15.
 * Executed before the specs
 */
var config = require('../../../config/properties-test');
var mongoose = require('mongoose');
var BoardModel = require('../../../models/boards_model');

beforeEach(function (done) {
    function connectDB(callback) {
        //Does not exist mongoose mock, create and remove siarest-test
        mongoose.connect(config.db.mongodb, function (err) {
            if (err) {
                console.error('[Database] Connection error', err);
                callback(err);
            } else {
                callback();
            }
        });
    }

    function clearDB(callback) {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function (err) {
                callback();
            });
        }

    }

    function initializeDB(callback){
        BoardModel.initialize(function (err) {
            callback();
        });
    }

    connectDB(function (err) {
        //TODO
        //Promisify
        if (err)
            throw err;
        else {
            clearDB(function(){
                initializeDB(function(){
                    done();
                });
            });
        }
    });
});

afterEach(function (done) {
    mongoose.disconnect();
    done();
});

afterAll(function(done){
    mongoose.connect(config.db.mongodb, function () {
        mongoose.connection.db.dropDatabase();
        done();
    });
});