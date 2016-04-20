var appConfig = require(__base + 'config/config');

var expressSession = require('express-session');
var MongoSessionStore = require('connect-mongodb-session')(expressSession);

var databaseUrl = appConfig.env('db_url');
var sessionCollection = appConfig.env('session_collection');

module.exports = function() {
   var store = new MongoSessionStore({
      uri: databaseUrl,
      collection: sessionCollection
   });

   store.on('error', function(e) {
      console.log("Mongoose [session] connection error: " + e);
   });   
   
   store.on('connected', function() {
      console.log("Mongoose [session] connection open.");
   });
   
   store.on('disconnected', function() {
      console.log("Mongoose [session] disconnected.");
   });
   
   process.on('SIGINT', function() {
     /* mongoose.connection.close(function () {
         console.log('Mongoose connection disconnected through app termination');
         process.exit(0);
      });*/
   });   
   
   return store;
}