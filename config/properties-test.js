/**
 * Created by joseant on 15/09/15.
 */
module.exports = {
    "db": {
        "mongodb": 'mongodb://' + (process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost')
        + ':' + (process.env.MONGO_PORT_27017_TCP_PORT || '27017') +
        '/siarest-test'
    },
    "server": {
        "host" : 'localhost',
        "port" : '3000'
    },
    "logger": {
        "api": "logs/api.log",
        "exception": "logs/exception.log"
    }
};