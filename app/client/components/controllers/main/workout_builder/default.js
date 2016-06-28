'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.workout_builder.default';

registerController(name, ['$scope',
                          require('services/workout_builder_service'),
                          require('services/promise'),
function($scope, WorkoutBuilderService, Promise) {

   $scope.currentEditingWorkout = WorkoutBuilderService.getCurrentWorkout() ?
   WorkoutBuilderService.getCurrentWorkout().clone() : null;

   $scope.isSaving = false;
   $scope.savingMessage = "";
   $scope.errorMessage = "";

   $scope.postSavingMessage = "";

   $scope.setIsSaving = function(isSaving, message) {
      $scope.isSaving = isSaving;
      $scope.savingMessage = message;
   }

   $scope.setPostSavingMessage = function(message) {
      $scope.postSavingMessage = message;
   }

   $scope.error = function(errorObject) {
      if (!errorObject) {
         $scope.errorMessage = "";
      } else {
         $scope.errorMessage = errorObject.toString(false);
      }
   }

   $scope.workoutSave = function(workout) {
      return Promise(function(resolve, reject) {
         $scope.setIsSaving(true);

         $scope.setPostSavingMessage("");
         $scope.error(null);

         WorkoutBuilderService.saveWorkout($scope.currentEditingWorkout, WorkoutBuilderService.getCurrentWorkout())
         .then(function(newWorkout) {
            $scope.currentEditingWorkout = newWorkout.clone();
            $scope.setPostSavingMessage("Success!");
            resolve();
         })
         .catch(function(error) {
            $scope.error(error);
            reject();
         })
         .finally(function() {
            $scope.setIsSaving(false);
         });
      });

   }  

   $scope.workoutDelete = function(workout) {

   } 

   $scope.getSavingMessage = function() {
      return $scope.savingMessage;
   }

   $scope.getStaticErrorMessage = function() {
      if ($scope.currentEditingWorkout) {
         return "";
      } else {
         if (WorkoutBuilderService.currentWorkoutIsNotFound()) {
            return "Workout does not exist.";
         } else if (WorkoutBuilderService.currentWorkoutIsNotAccessible()) {
            return "You do not have permission to view this workout.";
         } else {
            return "Unknown error";
         }
      }
   }
}])

module.exports = name;