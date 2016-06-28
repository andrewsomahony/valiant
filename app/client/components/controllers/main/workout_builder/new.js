'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.workout_builder.new';

registerController(name, ['$scope',
require('models/workout_builder/workout'),
require('services/workout_builder_service'),
require('services/error_modal'),
require('services/promise'),
require('services/state_service'),
function($scope, WorkoutModel, WorkoutBuilderService,
ErrorModal, Promise, StateService) {
   $scope.currentWorkout = null;

   $scope.newWorkout = function() {
      $scope.currentWorkout = new WorkoutModel();
      $scope.currentWorkout.setInternalVariable('is_unborn', true);
   }

   $scope.workoutSave = function(workout) {
      return Promise(function(resolve, reject) {
         WorkoutBuilderService.createWorkout($scope.currentWorkout)
         .then(function(newWorkout) {
            resolve();
            StateService.go("main.workout_builder", {workoutId: newWorkout.id});
         })
         .catch(function(error) {
            ErrorModal(error);
            reject();
         });
      });
   }

   $scope.workoutDelete = function(workout) {
      $scope.currentWorkout = null;
   }

   $scope.workoutCancel = function(workout) {
      $scope.currentWorkout = null;
   }
}])

module.exports = name;