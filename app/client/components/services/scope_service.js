'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.scope';

registerService('factory', name, [
function() {
   function ScopeService() {
      
   }
   
   ScopeService.parseBool = function(bool, defaultValue) {
      if (true === utils.isUndefinedOrNull(bool)) {
         return defaultValue;
      } else {
         if ('boolean' === typeof bool) {
            return bool;
         } else {
            if ('string' !== typeof bool) {
               throw new Error("ScopeService.parseBool: Variable is not a string!");
            }
            return 'false' !== bool.toLowerCase();
         }
      }
   }
   
   return ScopeService;
}
])

module.exports = name;