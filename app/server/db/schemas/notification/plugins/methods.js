'use strict';

var utils = require(__base + 'lib/utils');

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.frontEndObject = function(valuesToSkip) {
      var object = {
         _id: this.getId(),
         kind: this.kind,
         type: this.type,
         is_unread: this.is_unread,
         is_new: this.is_new,
         created_at: this.created_at,
         updated_at: this.updated_at,
      };

      if (this.fieldIsPopulated("_creator")) {
         object._creator = this._creator.frontEndObject();
      }

      if (this.fieldIsPopulated("_parent")) {
         object._parent = this._parent.frontEndObject();
      }

      utils.removeKeysFromObject(object, valuesToSkip);

      return object;
   }
}