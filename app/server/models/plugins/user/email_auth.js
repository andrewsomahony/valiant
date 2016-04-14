var crypto = require('crypto');

var ValiantError = require('../../../lib/error');

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
            return cb(ValiantError.fromMongooseError(error));
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
            return cb(error);
         } else {
            var emailToken = buffer.toString('hex');
            self.set(options.emailTokenField, emailToken);
            
            self.save(function(error) {
               if (error) {
                  return cb(ValiantError.fromMongooseError(error));
               } else {
                  cb(null, self);
               }
            });
         }
      })
   }
}