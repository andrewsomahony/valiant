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
            return utils.stringToBoolean(bool);
         }
      }
   }
   
   return ScopeService;
}
])

module.exports = name;