'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.set_builder.default';

registerController(name, ['$scope',
require('models/set_builder/workout'),
require('models/set_builder/set'),
function($scope, WorkoutModel, SetModel) {
   $scope.currentWorkout = new WorkoutModel();
   $scope.currentWorkout.setInternalVariable('is_unborn', true);

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
}])

module.exports = name;