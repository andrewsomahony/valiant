'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.state_service';

registerService('factory', name, ['$state',
function($state) {
   function StateService() {
      
   }
   
   // We can have a root state but then
   // a bunch of abstract states for layout
   // purposes.
   
   // main.home
   // main.login
   // main.error
   // main.login.unverified
   
   // admin.home
   
   var rootStateNameMap = {
      'main': 'main.page',
      'admin': 'admin'
   };
   
   var defaultPageStateName = '.default';
   
   function getStateObject(state, context) {
      context = context || null;
      
      var stateObject = $state.get(state, context);
      if (stateObject) {
         return stateObject;
      }
      
      var stateString = "";
      
      var stateArray = state.split('.');
      if (!stateArray) {
         return null;
      }
      
      var trueRootState = rootStateNameMap[stateArray[0]];
      
      if (!trueRootState) {
         return null;
      }
      
      stateString += trueRootState;
      
      for (var i = 1; i < stateArray.length; i++) {
         stateString += "." + stateArray[i];
      }
      
      stateObject = $state.get(stateString, context);
      
      if (!stateObject ||
          true === stateObject.abstract) {
         // Try to append the default string
         stateString += defaultPageStateName;
         stateObject = $state.get(stateString, context);
      }
      
      return stateObject;
   }
   
   StateService.hasState = function(name) {
      return getStateObject(name, $state.$current) ? true : false;
   }
      
   StateService.go = function(name, params, options) {
      var stateObject = getStateObject(name, $state.$current);
         
      if (!stateObject) {
         throw new Error("StateService.go: Invalid state! " + name);
      } else {
         if (true === stateObject.abstract) {
            throw new Error("StateService.go: Cannot go to an abstract state! " + name);
         }
      }
      
      return $state.go(stateObject.name, params, options);
   }
   
   StateService.params = function() {
      return $state.params || {};
   }
   
   return StateService;
}]);

module.exports = name;