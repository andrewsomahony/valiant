'use strict';

var LocalStrategy = require('passport-local').Strategy;

// We extend the passport-local-mongoose-email strategy
// to return the user object if the e-mail is unverified.

module.exports = function(schema, options) {
   schema.statics.extendAuthenticate = function() {
      var self = this;
      
      return function(username, password, cb) {
         self.findByUsername(username, function(error, user) {
            if (error) {
               return cb(error);
            } else {
               if (user) {
                  if (user.isAuthenticated) {
                     return user.authenticate(password, cb);
                  } else {
                     return cb(null, user, {message: options.userEmailUnverifiedError});
                  }                  
               } else {
                  return cb(null, false, {message: options.incorrectUsernameError});
               }
            }
         })
      }
   }
   
   schema.methods.setEmailAddress = function(email, cb) {
      var self = this;
      
      self.set(options.usernameField, email);
      self.save(function(error) {
         if (error) {
            cb(ValiantError.fromErrorObject(error));
         } else {
            cb(null, self);
         }
      })
   }
   
   schema.statics.createStrategy = function() {
      return new LocalStrategy(options, this.extendAuthenticate());
   }
}