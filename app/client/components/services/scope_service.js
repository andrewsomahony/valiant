'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.scope';

registerService('factory', name, ['$rootScope',
function($rootScope) {
   function ScopeService() {
      
   }

   ScopeService.watchBool = function($scope, 
   $attributes, variableName, defaultValue, callbackFn) {
      $scope.$watch($attributes[variableName], function(newValue) {
         console.log(variableName, $attributes);
         $scope[variableName] = ScopeService.parseBool(newValue, defaultValue);
         if (callbackFn) {
            callbackFn(newValue);
         }
      });
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
   
   ScopeService.newRootScope = function(isIsolate, parent) {
      if (true === utils.isUndefinedOrNull(isIsolate)) {
         isIsolate = true;
      }
      parent = parent || null;
      
      return $rootScope.$new(isIsolate, parent);
   }
   
   return ScopeService;
}
])

module.exports = name;