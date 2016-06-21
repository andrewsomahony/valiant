'use strict';

var registerDirective = require('directives/register');

var name = 'workout';

registerDirective(name, [require('models/set_builder/workout'),
                         require('services/set_builder_service'),
                         require('services/scope_service'),
function(WorkoutModel, SetBuilderService, ScopeService) {
   return {
      restrict: "E",
      scope: {
         model: "=",
         saveButtonText: "@",
         cancelButtonText: "@",
         onSaveClicked: "&",
         onEditClicked: "&",
         onCancelClicked: "&",
         onDeleteClicked: "&",

         onEditSet: "&",

         //isEditable: "@",
         //canEditInline: "@"
      },
      templateUrl: "directives/set_builder/workout_renderer.html",
      link: function($scope, $element, $attributes) {
         $element.addClass('workout');

         ScopeService.watchBool($scope, $attributes, 'isEditable');
         ScopeService.watchBool($scope, $attributes, 'canEditInline');

         $scope.setIsEditing = function(isEditing) {
            $scope.isEditing = isEditing;
            if (isEditing) {
               if (!$scope.editingWorkout) {
                  $scope.editingWorkout = new WorkoutModel();
               }
               $scope.editingWorkout.fromModel($scope.model);
            }
         }

         $scope.newSet = function() {
            var set = $scope.editingWorkout.pushOntoChildArray('sets');
            set.setInternalVariable('is_unborn', true);
         }

         $scope.editSet = function(set) {
            $scope.onEditSet({set: set});
         }

         $scope.saveSet = function(set) {
            set.setInternalVariable('is_unborn', false);
         }

         $scope.deleteSet = function(set) {
            $scope.editingWorkout.deleteFromChildArray('sets', set);
         }

         $scope.cancelSet = function(set) {
            if (set.getInternalVariable('is_unborn')) {
               $scope.deleteSet(set);
            }
         }

         $scope.editClicked = function() {
            if (true === $scope.canEditInline) {
               $scope.setIsEditing(true);
            }
            $scope.onEditClicked({workout: $scope.model});
         }

         $scope.deleteClicked = function() {
            $scope.onDeleteClicked({workout: $self.model});
         }

         $scope.saveClicked = function() {
            $scope.setIsEditing(false);
            $scope.model.fromModel($scope.editingWorkout);

            $scope.onSaveClicked({workout: $scope.model});
         }

         $scope.cancelClicked = function() {
            $scope.setIsEditing(false);
            $scope.onCancelClicked({workout: $scope.model});
         }
      }
   };
}]);

module.exports = name;