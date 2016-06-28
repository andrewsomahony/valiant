'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.error_modal';

registerService('factory', 
                name, 
                [require('services/modal'),
                 require('models/error'),
                 require('services/scope_service'),
                 require('services/promise'),
function(modalService, ErrorModel, ScopeService, Promise) {
   function errorModalService(error) {
      return Promise(function(resolve, reject) {
         var $modalScope = ScopeService.newRootScope();

         if (true === utils.objectIsTypeOfClass(error, ErrorModel)) {
            $modalScope.errorMessage = error.toString();
         } else {
            $modalScope.errorMessage = error;
         }

         $modalScope.okClicked = function() {
            resolve();
            this.$hide();
         }

         modalService($modalScope, 'modals/full/error_modal_full.html', 
         'modals/partials/error_modal.html', {
            keyboard: false,
            backdrop: 'static',
            title: "Error"
         });
      });

   }

   return errorModalService;
}])

module.exports = name