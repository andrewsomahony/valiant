'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.workout_builder.new';

registerController(name, ['$scope',
require('models/workout_builder/workout'),
require('models/workout_builder/set'),
function($scope, WorkoutModel, SetModel) {
   $scope.currentWorkout = null;
   $scope.isEditingSet = false;

   $scope.newWorkout = function() {
      $scope.currentWorkout = new WorkoutModel();
      $scope.currentWorkout.setInternalVariable('is_unborn', true);
   }

   $scope.workoutSave = function(workout) {
      $scope.currentWorkout.setInternalVariable('is_unborn', false);
   }

   $scope.workoutEdit = function(workout) {

   }

   $scope.workoutDelete = function(workout) {
      
   }

   $scope.workoutCancel = function(workout) {
      $scope.currentWorkout = null;
   }
}])

module.exports = name;