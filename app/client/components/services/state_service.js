'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.state_service';

registerService('factory', name, ['$state',
function($state) {
   function StateService() {
      
   }
   
   var rootStateNameMap = {
      'main': 'main.page',
      'admin': 'admin'
   };
   
   // Alias 'home' to 'main'.
   rootStateNameMap['home'] = rootStateNameMap['main'];
   
   var defaultPageStateName = '.default';
   var defaultSubState = '.home' + defaultPageStateName;
   
   function parseState(stateObject) {
      
   }
   
   console.log("STATE ", $state.get('main.page'));
   
   StateService.go = function(name, params, options) {
      if (utils.isPlainObject(name)) {
         name = parseState(name);
      }

      var stateObject = $state.get(name);
         
      if (!stateObject) {
         name = parseState(name);
         
         if (!name) {
            throw new Error("StateService.go: Invalid state! " + name);
         }
      } else {
         if (true === stateObject.abstract) {
            throw new Error("StateService.go: Cannot go to an abstract state! " + name);
         }
      }
      
      return $state.go(name, params, options);
   }
   
   StateService.params = function() {
      return $state.params || {};
   }
   
   return StateService;
}]);

module.exports = name;