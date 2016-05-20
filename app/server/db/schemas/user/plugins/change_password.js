'use strict';

module.exports = function(schema, options) {
   options = options || {};
   
   schema.methods.changePassword = function(newPassword, cb) {
      this.setPassword(newPassword, function(error, user) {
         if (error) {
            cb(error);
         } else {
            if (!user) {
               cb(null, false);
            } else {
               user.save(function(error, newUser) {
                  if (error) {
                     cb(error);
                  } else {
                     if (!newUser) {
                        cb(null, false);
                     } else {
                        cb(null, newUser);
                     }
                  }
               });
            }
         }
      });
   }
}