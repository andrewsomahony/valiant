'use strict';

var crypto = require('crypto');
var ValiantError = require(__base + 'lib/error');

var ValiantEmail = require(__base + 'lib/email');

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
      
      crypto.randomBytes(48, function(error, buffer) {
         if (error) {
            return cb(ValiantError.fromErrorObject(error));
         } else {
            var emailToken = buffer.toString('hex');
            self.set(options.emailTokenField, emailToken);
            
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
                  return cb(error);
               } else {
                  self.save(function(error) {
                     if (error) {
                        return cb(error);
                     } else {
                        cb(null, self);
                     }
                  });
               }
            });
         }
      })
   }
}