'use strict';

var mongoose = require('mongoose');
var utils = require(__base + "lib/utils");

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.frontEndObject = function(valuesToSkip) {
      valuesToSkip = valuesToSkip || [];

      var object = {
         _id: this._id,
         text: this.text,
         type: this.type,
         created_at: this.created_at,
         updated_at: this.updated_at
      };

      if (this.fieldIsPopulated('_creator')) {
         object['_creator'] = this._creator.frontEndObject();
      }
      if (this.fieldIsPopulated('_parent')) {
         object['_parent'] = this._parent.frontEndObject();
      }

      utils.removeKeysFromObject(object, valuesToSkip);

      return object;
   }
}