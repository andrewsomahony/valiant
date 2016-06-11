'use strict';

var registerService = require('services/register');

var name = 'services.confirm_modal';

registerService('factory', name, [require('services/modal'),
                                  require('services/promise'),
                                  require('services/scope_service'),
function(ModalService, Promise, ScopeService) {
   function ConfirmModalService(message) {
      return Promise(function(resolve, reject, notify) {
         var $modalScope = ScopeService.newRootScope();
         
         $modalScope.message = message;
         $modalScope.onYesClicked = function() {
            resolve(true);
            this.$hide();
         }
         $modalScope.onNoClicked = function() {
            resolve(false);
            this.$hide();
         }
         
         ModalService($modalScope, "modals/full/confirm_modal_full.html", 
         "modals/partials/confirm_modal.html", {
            keyboard: false,
            backdrop: 'static',
            title: "Confirm"
         });
      });
   }
   
   return ConfirmModalService;
}]);

module.exports = name;