'use strict';

var token = require(__base + 'lib/token');

var ValiantError = require(__base + 'lib/error');
var ValiantEmail = require(__base + 'lib/email');

var hostnameUtil = require(__base + 'lib/hostname');

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
      
      if (!token) {
         cb(ValiantError.withMessage("Invalid token!"));
      } else {      
         self.findByResetPasswordToken(token, function(error, user) {
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
                        user.set(options.resetPasswordTokenField, "");
                           
                        user.save(function(error) {
                           if (error) {
                              cb(ValiantError.fromErrorObject(error));
                           } else {
                              cb(null, user);
                           }
                        });
                     }
                  })
               }
            }
         });
      }
   }
   
   schema.methods.sendPasswordResetEmail = function(cb) {
      var self = this;
      
      token.createToken(48, true)
      .then(function(resetPasswordToken) {
         self.set(options.resetPasswordTokenField, resetPasswordToken);

         ValiantEmail({
            to: self.email,
            from: ValiantEmail.doNotReplyEmailAddress(),
            fromname: "Valiant Athletics",
            template: "forgot_password",
            templateParams: {
               reset_password_link: hostnameUtil.constructUrl("/check/forgot_password/" + resetPasswordToken)
            }
         }, function(error) {
            if (error) {
               return cb(error);
            } else {
               self.save(function(error) {
                  if (error) {
                     return cb(ValiantError.fromErrorObject(error));
                  } else {
                     cb(null, self);
                  }
               });
            }
         });         
      })
      .catch(function(error) {
         cb(error);
      })
   }
}