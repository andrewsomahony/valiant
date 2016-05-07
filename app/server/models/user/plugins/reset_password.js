'use strict';

var crypto = require('crypto');

var ValiantError = require(__base + 'lib/error');

module.exports = function(schema, options) {
   options = options || {};

   options.resetPasswordTokenField = 'reset_password_token';  

   var schemaFields = {};
   
   schemaFields[options.resetPasswordTokenField] = String;
   
   schema.add(schemaFields);
   
   schema.statics.findByResetPasswordToken = function(token, cb) {
      var queryParameters = {};
      
      queryParameters[options.resetPasswordTokenField] = token;
      
      var query = this.findOne(queryParameters);
      
      if (cb) {
         query.exec(cb);
      } else {
         return query;
      }      
   }
   
   schema.statics.resetPassword = function(token, newPassword, cb) {
      var self = this;
      
      self.findByResetPasswordToken(token, function(error, user) {
         if (!token) {
            cb(ValiantError.withMessage("Invalid token!"));
         } else {
            if (error) {
               cb(ValiantError.fromErrorObject(error));
            } else {
               if (!user) {
                  cb(ValiantError.withMessage("Invalid token!"));
               } else {
                  user.setPassword(newPassword, function(error, user) {
                     if (error) {
                        cb(ValiantError.fromErrorObject(error));
                     } else {
                        cb(null, user);
                     }
                  })
               }
            }
         }
      });
   }
   
   schema.methods.sendPasswordResetEmail = function(cb) {
      var self = this;
      
      crypto.randomBytes(48, function(error, buffer) {
         if (error) {
            cb(ValiantError.fromErrorObject(error));
         } else {
            self.set(options.resetPasswordTokenField, buffer);

            ValiantEmail({
               to: self.email,
               from: ValiantEmail.doNotReplyEmailAddress(),
               fromname: "Valiant Athletics",
               template: "forgot_password",
               templateParams: {
                  reset_password_link: hostnameUtil.constructUrl("/reset_password/?password_reset_token=" + buffer)
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
      });
   }
}