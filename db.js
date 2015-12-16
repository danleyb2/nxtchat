var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db;
//provide a sensible default for local development
mongodb_connection_string = 'mongodb://127.0.0.1:27017/';
var mo = 'mongodb';
var host = '127.0.0.1';
var port = '27017';
var username = 'danleyb2';
var password = 'ussdkepass';
var databasename = '';

// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL;

    username = connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
    password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
    host = process.env.OPENSHIFT_MONGODB_DB_HOST;
    port = process.env.OPENSHIFT_MONGODB_DB_PORT;
    databasename = process.env.OPENSHIFT_APP_NAME;
}

var state = {
    db: undefined
};

exports.connect = function (database, done) {
    if (state.db != undefined)return done();
    new Db(database, new Server(host, port, {auto_reconnect: true})).open(function (err, db) {

        //new Db(database,new Server('ds041633.mongolab.com',41633,{auto_reconnect:true})).open(function(err,db){
        //new Db(database,new Server('ds041633.mongolab.com',41633,{auto_reconnect:true})).open(function(err,db){
        if (!err) {
            state.db = db;
            console.log('connected to db');
            // Authenticate
            state.db.authenticate(username, password, function (err, result) {
                if (result)return done();
            });
        }
        return done(err);
    });

};

exports.get = function () {
    return state.db;
};

exports.close = function (done) {
    if (state.db != undefined) {
        state.db.close(function (err, result) {
            state.db = undefined;
            state.mode = null;
            done(err);
        });
    }
};



