'use strict';

var ValiantError = require(__base + 'lib/error');
var ValiantEmail = require(__base + 'lib/email');
var hostnameUtil = require(__base + 'lib/hostname');

var token = require(__base + 'lib/token');

// This is exactly the same as email_auth,
// but with different variables :-/

module.exports = function(schema, options) {
   options = options || {};
   
   options.pendingEmailField = 'pending_email';
   options.pendingEmailTokenField = 'pending_email_token';
   options.pendingEmailAuthTokenField = 'pending_email_auth_token';
   
   var schemaFields = {};

   schemaFields[options.pendingEmailField] = String;   
   schemaFields[options.pendingEmailTokenField] = String;
   schemaFields[options.pendingEmailAuthTokenField] = String;
   
   schema.add(schemaFields);
   
   schema.statics.findByPendingEmailToken = function(pendingEmailToken, cb) {
      var queryParameters = {};
      
      queryParameters[options.pendingEmailTokenField] = pendingEmailToken;
      
      var query = this.findOne(queryParameters);
      
      if (cb) {
         query.exec(cb);
      } else {
         return query;
      }
   }
   
   schema.statics.findByPendingEmailAuthToken = function(pendingEmailAuthToken, cb) {
      var queryParameters = {};
      
      queryParameters[options.pendingEmailAuthTokenField] = pendingEmailAuthToken;
      
      var query = this.findOne(queryParameters);
      
      if (cb) {
         query.exec(cb);
      } else {
         return query;
      }      
   }
   
   // We might not actually need this, as we 
   // need to look up the user in the main method handler
   // to make sure the permissions and such are ok.
   
   schema.statics.resendPendingEmailAuthenticationEmail = function(pendingEmailToken, cb) {
      this.findByPendingEmailToken(pendingEmailToken, function(error, user) {
         if (error) {
            cb(ValiantError.fromErrorObject(error));
         } else {
            if (!user) {
               return cb(ValiantError.withMessage("Invalid e-mail token!"));
            } else {
               user.sendPendingEmailAuthenticationEmail(cb);
            }
         }
      })
   }
      
   schema.methods.sendPendingEmailAuthenticationEmail = function(cb) {
      var self = this;
      
      // The regular e-mail auth doesn't create
      // a token for the authentication because
      // I'm using a library to do it, so I'm leaving
      // it alone for now.
      
      token.createToken(48, true)
      .then(function(pendingEmailToken) {
         self.set(options.pendingEmailTokenField, pendingEmailToken);
         
         token.createToken(48, true)
         .then(function(pendingEmailAuthToken) {
            self.set(options.pendingEmailAuthTokenField, pendingEmailAuthToken);
            
            self.save(function(error) {
               if (error) {
                  cb(ValiantError.fromErrorObject(error));
               } else {
                  ValiantEmail({
                     to: self.pending_email,
                     from: ValiantEmail.doNotReplyEmailAddress(),
                     fromname: "Valiant Athletics",
                     template: "verify-pending-email",
                     templateParams: {
                        first_name: self.first_name,
                        pending_email: self.pending_email,
                        email: self.email,
                        verify_link: hostnameUtil.constructUrl("/verify/pending_email/" + pendingEmailAuthToken)
                     }
                  }, function(error) {
                     if (error) {
                        console.log("Error in sending user pending e-mail authentication e-mail!");
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
         })
      })
      .catch(function(error) {
         cb(error);
      })
   }
   
   schema.methods.cancelEmailAddressChange = function(cb) {
      var self = this;
      
      self.set(options.pendingEmailField, "");
      self.set(options.pendingEmailTokenField, "");
      self.set(options.pendingEmailAuthTokenField, "");
      
      self.save(function(error, user) {
         if (error) {
            cb(ValiantError.fromErrorObject(error));  
         } else {
            cb(null, user);
         }
      })
   }
   
   schema.methods.changeEmailAddress = function(newEmail, cb) {
      var self = this;
      
      self.set(options.pendingEmailField, newEmail);
      self.sendPendingEmailAuthenticationEmail(function(error, user) {
         if (error) {
            cb(ValiantError.fromErrorObject(error));
         } else {
            cb(null, user);
         }
      })
   }

   // We have a pending_email stored in the db,
   // so we just need to find the auth token and
   // make the switch.
   
   schema.statics.setNewEmailAddressWithToken = function(pendingEmailAuthToken, cb) {
      this.findByPendingEmailAuthToken(pendingEmailAuthToken, function(error, user) {
         if (error) {
            cb(ValiantError.fromErrorObject(error));
         } else {
            if (!user) {
               cb(ValiantError.withMessage("Invalid token!"));
            } else {
               var pendingEmailAddress = user.get(options.pendingEmailField);
               
               if (!pendingEmailAddress) {
                  cb(ValiantError.withMessage("No pending e-mail address saved!"));
               } else {             
                  user.setEmailAddress(pendingEmailAddress, function(error, user) {
                     if (error) {
                        cb(ValiantError.fromErrorObject(error));
                     } else {
                        user.set(options.pendingEmailField, "");
                        user.set(options.pendingEmailAuthTokenField, "");
                        user.set(options.pendingEmailTokenField, "");
                        
                        user.save(function(error) {
                           if (error) {
                              cb(ValiantError.fromErrorObject(error));
                           } else {
                              cb(null, user);
                           }
                        })
                     }
                  });
               }
            }
         }
      })
   }
}