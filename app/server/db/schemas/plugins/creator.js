'use strict';

var Promise = require(__base + 'lib/promise');

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.getCreatorId = function() {
      if (this.populated("_creator")) {
         return this._creator.getId();
      } else {
         return this._creator;
      }
   }

   schema.methods.getCreator = function() {
      if (this.populated("_creator")) {
         return this._creator;
      } else {
         return null;
      }
   }

   schema.methods.populateCreator = function() {
      var self = this;

      return Promise(function(resolve, reject) {
         self.populate({path: "_creator"}, function(error, newObject) {
            if (error) {
               reject(error);
            } else {
               resolve(newObject);
            }
         })
      });
   }
}