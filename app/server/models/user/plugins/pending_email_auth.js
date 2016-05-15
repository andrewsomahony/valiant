'use strict';

var crypto = require('crypto');

var ValiantError = require(__base + 'lib/error');
var ValiantEmail = require(__base + 'lib/email');
var hostnameUtil = require(__base + 'lib/hostname');

// This is exactly the same as email_auth,
// but with different variables :-/

module.exports = function(schema, options) {
   options = options || {};
   
   options.pendingEmail = 'pending_email';
   options.pendingEmailTokenField = 'pending_email_token';
   
   var schemaFields = {};

   schemaFields[options.pendingEmail] = String;   
   schemaFields[options.pendingEmailTokenField] = String;
   
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
}