'use strict';

var registerService = require('services/register');

var name = 'services.state_service';

registerService('factory', name, ['$state',
function($state) {
   function StateService() {
      
   }
   
   StateService.go = function(name, params, options) {
      return $state.go(name, params, options);
   }
   
   return StateService;
}]);

module.exports = name;