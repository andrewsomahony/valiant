'use strict';

var mongoose = require('mongoose');

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.getId = function() {
      return this._id;
   }

   // We need this method, as if we do
   // a deep population, the "populated()"
   // method doesn't work!

   schema.methods.fieldIsPopulated = function(field) {
      return this[field] &&
         !(this[field] instanceof mongoose.Types.ObjectId);
   }
}