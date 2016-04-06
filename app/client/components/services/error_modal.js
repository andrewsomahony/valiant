'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.error_modal';

registerService('factory', 
                name, 
                [require('services/modal'),
                 require('models/error'),
                 '$rootScope',
function(modalService, ErrorModel, $rootScope) {
   function errorModalService(error) {
      var $modalScope = $rootScope.$new(true)

      if (true === utils.objectIsTypeOfClass(error, ErrorModel)) {
          $modalScope.errorMessage = error.toString();
      } else {
          $modalScope.errorMessage = error;
      }

      modalService($modalScope, null, 'modals/partials/error_modal.html', {
         keyboard: false,
         backdrop: 'static',
         title: "Error"
      })
   }

   return errorModalService;
}])

module.exports = name