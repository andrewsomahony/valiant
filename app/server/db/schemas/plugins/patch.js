'use strict';

var utils = require(__base + 'lib/utils');

var Model = require(__base + 'lib/model');

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.userPatch = function(patchData, cb) {
      var newPatchData = utils.grep(patchData, function(patch) {
         var found = false;
         Model.serverVariables.every(function(serverVariable) {
            if (-1 !== patch.path.indexOf(serverVariable)) {
               found = true;
               return false;
            } else {
               return true;
            }
         });
         return !found;
      });
      
      this.patch(newPatchData, cb);
   }
}