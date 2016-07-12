'use strict';

var registerService = require('services/register');

var name = 'services.workout_modal';

registerService('factory', name, [require('services/modal'),
                                  require('services/scope_service'),
                                  require('services/promise'),
function(ModalService, ScopeService, Promise) {
   function WorkoutModalService(workoutModel) {
      return Promise(function(resolve) {
         var $modalScope = ScopeService.newRootScope();

         $modalScope.onOkClicked = function() {
            resolve();
            this.$hide();
         }

         $modalScope.workout = workoutModel;

         ModalService($modalScope, "modals/full/workout_modal.html",
            null, {
            title: workoutModel.name
         });
      });
   }

   return WorkoutModalService;
}
]);

module.exports = name;