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

   $scope.setIsEditingSet = function(isEditingSet, setModel) {
      $scope.isEditingSet = isEditingSet;
      if (isEditingSet) {
         $scope.currentEditingSet = setModel;
      }
   }

   $scope.saveSet = function(set) {
      set.setInternalVariable('is_unborn', false);
      $scope.setIsEditingSet(false);
   }

   $scope.editSet = function(set) {
      $scope.setIsEditingSet(true, set);
   }

   $scope.cancelEditSet = function(set) {
      if (set.getInternalVariable('is_unborn')) {
         $scope.currentWorkout.deleteFromChildArray('sets', set);
      }      
      $scope.setIsEditingSet(false);
   }

   $scope.workoutSave = function(workout) {

   }

   $scope.workoutEdit = function(workout) {

   }

   $scope.workoutDelete = function(workout) {
      
   }

   $scope.workoutCancel = function(workout) {
      $scope.setIsEditingSet(false);
      $scope.currentWorkout = null;
   }

   $scope.getWorkoutContainerStyle = function() {
      var style = {};

      if (!$scope.isEditingSet) {
         style['text-align'] = 'center';
      }

      return style;
   }

   $scope.getWorkoutContainerClass = function() {
      var classes = [];

      if ($scope.isEditingSet) {
         return "col-lg-6";
      }

      return classes;
   }

   $scope.getWorkoutStyle = function() {
      var style = {};

      style['display'] = 'inline-block';
      style['width'] = $scope.isEditingSet ? '100%' : '50%';
      style['font-size'] = '2em';
      style['text-align'] = 'left';

      return style;
   }
}])

module.exports = name;