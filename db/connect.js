var appConfig = require('../config/config');
var mongoose = require('mongoose');
var databaseUrl = appConfig.env('db_url');

mongoose.connection.on('connected', function () {
   console.log('Mongoose connection open to ' + databaseUrl);
});
 
mongoose.connection.on('error', function (error) {
   console.log('Mongoose connection error: ' + error);
});

mongoose.connection.on('disconnected', function () {
   console.log('Mongoose connection disconnected');
});

process.on('SIGINT', function() {
   mongoose.connection.close(function () {
      console.log('Mongoose connection disconnected through app termination');
      process.exit(0);
   });
});

module.exports = function() {
    mongoose.connect(databaseUrl);
    return mongoose.connection;
}