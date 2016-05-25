'use strict';

var crypto = require('crypto');
var ValiantError = require(__base + 'lib/error');

var ValiantEmail = require(__base + 'lib/email');

var token = require(__base + 'lib/token');

var hostnameUtil = require(__base + 'lib/hostname');

module.exports = function(schema, options) {
   options = options || {};
   
   options.emailTokenField = 'email_token';
   
   var schemaFields = {};
   
   schemaFields[options.emailTokenField] = String;
   
   schema.add(schemaFields);
   
   schema.statics.findByEmailToken = function(emailToken, cb) {
      var queryParameters = {};
      
      queryParameters[options.emailTokenField] = emailToken;
      
      var query = this.findOne(queryParameters);
      
      if (cb) {
         query.exec(cb);
      } else {
         return query;
      }
   }
   
   schema.statics.resendAuthenticationEmail = function(emailToken, cb) {
      var self = this;
      
      self.findByEmailToken(emailToken, function(error, user) {
         if (error) {
            return cb(error);
         } else {
            if (!user) {
               return cb(ValiantError.withMessage("Invalid e-mail token"));
            } else {
               user.sendAuthenticationEmail(cb);
            }
         }
      })
   }
   
   // Only called if the user is brand new
   // or has a valid e-mail token
      
   schema.methods.sendAuthenticationEmail = function(cb) {
      var self = this;
      
      // The pending e-mail auth creates
      // a token for the authentication because
      // I'm using a library to do this authentication,
      // and kinda just leaving it alone for now.  
      
      token.createToken(48, true)
      .then(function(emailToken) {
         self.set(options.emailTokenField, emailToken);
         
         self.save(function(error) {
            if (error) {
               cb(ValiantError.fromErrorObject(error));
            } else {
               ValiantEmail({
                  to: self.email,
                  from: ValiantEmail.doNotReplyEmailAddress(),
                  fromname: "Valiant Athletics Registration",
                  template: "verify",
                  templateParams: {
                     first_name: self.first_name,
                     verify_link: hostnameUtil.constructUrl("/verify/" + self.authToken)
                  }
               }, function(error) {
                  if (error) {
                     console.log("Error in sending user authentication e-mail!");
                  }
                  
                  // Silently fail if the e-mail doesn't send.
                  // IF it doesn't send, the user can just click the link
                  // for another one, I just need to be able to track
                  // these failures in the logs.
                  
                  cb(null, self);
               });         
            }
         })       
      })
      .catch(function(error) {
         cb(error);
      });
   }
   
   // This is utterly ridiculous...
   // We need to extend this because the plugin we
   // got from npm does not take into account
   // that the user with the token isn't in the database,
   // so it just hangs and never does anything...

   schema.statics.verifyEmail = function(authToken, cb) {
      var self = this;
      self.findByAuthToken(authToken, function(error, user) {
         if (error) { 
            return cb(ValiantError.fromErrorObject(error)); 
         } else {
            if (!user) {
               return cb(ValiantError.notFound()); 
            } else {
               user.isAuthenticated = true;
               user.save(function(error, newUser) {
                   if (error) {
                      return cb(ValiantError.fromErrorObject(error));
                   } else {
                      return cb(null, user);
                   }
               })
            }
         }
      });
   };

}