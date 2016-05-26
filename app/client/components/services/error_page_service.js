'use strict';

var registerService = require('services/register');

var name = 'services.error_page';

registerService('factory', name, [require('services/state_service'),
                                  require('services/error'),
function(StateService, ErrorService) {
   
   function ErrorPageService() {
      
   }
   
   var errorObject = null;
   
   ErrorPageService.go = function(errorMessage) {
      errorObject = ErrorService.localError(errorMessage);
      StateService.go('main.page.error.default');
   }
   
   ErrorPageService.getErrorMessage = function() {
      if (!errorObject) {
         return "";
      } else {
         return errorObject.message;
      }
   }
   
   return ErrorPageService;
}]);

module.exports = name;