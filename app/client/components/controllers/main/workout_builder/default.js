'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.workout_builder.default';

registerController(name, ['$scope',
                          require('services/workout_builder_service'),
                          require('services/promise'),
                          require('services/user_service'),
                          require('services/date_service'),
function($scope, WorkoutBuilderService, Promise, UserService,
DateService) {

   $scope.currentEditingWorkout = WorkoutBuilderService.getCurrentWorkout() ?
   WorkoutBuilderService.getCurrentWorkout().clone() : null;

   $scope.isSaving = false;
   $scope.savingMessage = "";
   $scope.errorMessage = "";

   $scope.postSavingMessage = "";

   $scope.canEditWorkout = function() {
      if ($scope.currentEditingWorkout.creator.id === 
            UserService.getCurrentUserId()) {
         return true;
      } else {
         return false;
      }
   }

   $scope.getWorkoutUpdatedDateString = function() {
      return DateService.dateStringToFormattedString($scope.currentEditingWorkout.updated_at);
   }

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
            $scope.currentEditingWorkout.fromModel(newWorkout);
            $scope.setPostSavingMessage("Workout saved!");
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