'use strict';

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.getId = function() {
      return this._id;
   }
}