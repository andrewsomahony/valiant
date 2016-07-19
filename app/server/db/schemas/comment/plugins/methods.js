'use strict';

var mongoose = require('mongoose');

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.frontEndObject = function() {
      var object = {
         text: this.text,
         created_at: this.created_at,
         updated_at: this.updated_at
      };
      
      if (this.fieldIsPopulated('_creator')) {
         object['_creator'] = this._creator.frontEndObject();
      }

      return object;
   }
}