'use strict';

var crypto = require('crypto');
var ValiantError = require(__base + 'lib/error');

var ValiantEmail = require(__base + 'lib/email');

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
   
   schema.methods.sendAuthenticationEmail = function(cb) {
      var self = this;
      
      crypto.randomBytes(48, function(error, buffer) {
         if (error) {
            return cb(ValiantError.fromErrorObject(error));
         } else {
            var emailToken = buffer.toString('hex');
            self.set(options.emailTokenField, emailToken);
            
            sendgrid.send({
               to: self.email,
               from: "do-not-reply@valiantathletics.com",
               subject: "Welcome to Valiant Athletics!",
               text: "Confirm your e-mail man!"
            }, function(error, json) {
               if (error) {
                  cb(error);
               }
            });         
            
            self.save(function(error) {
               if (error) {
                  return cb(error);
               } else {
                  cb(null, self);
               }
            });
         }
      })
   }
}