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
      if (errorMessage) {
         errorObject = ErrorService.localError(errorMessage);
      } else {
         errorObject = null;
      }
      
      StateService.go('main.error');
   }
   
   ErrorPageService.getErrorMessage = function() {
      if (!errorObject) {
         return "";
      } else {
         return errorObject.toString(false);
      }
   }
   
   return ErrorPageService;
}]);

module.exports = name;