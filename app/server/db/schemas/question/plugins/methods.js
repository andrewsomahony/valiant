'use strict';

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.frontEndObject = function() {
      var object = this;

      if (this.populated('_creator')) {
         object._creator = this._creator.frontEndObject();
      }

      return object;
   }
}