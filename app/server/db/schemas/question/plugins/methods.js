'use strict';

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.frontEndObject = function() {
      var object = this;

      return object;
   }
}