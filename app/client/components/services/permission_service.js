'use strict';

var registerService = require('services/register');

var name = 'services.permission_service';

registerService('factory', name, [
function() {
   function PermissionService() {
      
   }
   
   PermissionService.stateRequiresLogin = function(state) {
      return 'admin.home.default' === state ||
             'main.page.question.ask' === state;
   }
   
   PermissionService.stateHiddenWithLogin = function(state) {
      return 'main.page.login.default' === state;
   }
   
   return PermissionService;
}
]);

module.exports = name;