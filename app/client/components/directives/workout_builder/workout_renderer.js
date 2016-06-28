'use strict';

var registerDirective = require('directives/register');

var name = 'workout';

registerDirective(name, [require('models/workout_builder/workout'),
                         require('services/workout_builder_service'),
                         require('services/scope_service'),
                         require('services/promise'),
function(WorkoutModel, SetBuilderService, ScopeService, Promise) {
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
         onCancelSet: "&",
         onDeleteSet: "&",

         //canEditSetsInline
         //isInitiallyEditing: "@",
         //isEditable: "@",
         //canEditInline: "@"
      },
      templateUrl: "directives/workout_builder/workout_renderer.html",
      link: function($scope, $element, $attributes) {
         $element.addClass('workout');

         $scope.hasCheckedInitiallyEditing = false;

         ScopeService.watchBool($scope, $attributes, 'canEditSetsInline', true);
         ScopeService.watchBool($scope, $attributes, 'isEditable', true);
         ScopeService.watchBool($scope, $attributes, 'canEditInline', true);
         ScopeService.watchBool($scope, $attributes, 'isInitiallyEditing', false, function(newValue) {
            if (!$scope.hasCheckedInitiallyEditing) {
               $scope.hasCheckedInitiallyEditing = true;

               if (true === $scope.isInitiallyEditing) {
                  $scope.editClicked();
               }
            }
         });

         $scope.getRunningTotal = function(model, index) {
            var runningTotal = 0;
            model.sets.every(function(set, i) {
               if (i > index) {
                  return false;
               } else {
                  runningTotal += set.getTotalDistance();
                  return true;
               }
            });
            return runningTotal;
         }

         $scope.setIsEditing = function(isEditing) {
            $scope.isEditing = isEditing;
            if (isEditing) {
               if (!$scope.editingWorkout) {
                  $scope.editingWorkout = new WorkoutModel();
               }
               $scope.editingWorkout.fromModel($scope.model);
            }
            $scope.model.setInternalVariable('is_editing', isEditing);
         }

         $scope.newSet = function() {
            var set = $scope.editingWorkout.pushOntoChildArray('sets');
            set.setInternalVariable('is_unborn', true);
         }

         $scope.editSet = function(set) {
            if (false === $scope.canEditSetsInline) {
               $scope.onEditSet({set: set});
            }
         }

         $scope.saveSet = function(set) {
            set.setInternalVariable('is_unborn', false);
         }

         $scope.deleteSet = function(set) {
            console.log(set);
            $scope.editingWorkout.deleteFromChildArray('sets', set);
            if (false === $scope.canEditSetsInline) {
               $scope.onDeleteSet({set: set});
            }
         }

         $scope.cancelSet = function(set) {
            if (set.getInternalVariable('is_unborn')) {
               $scope.deleteSet(set);
            }
            if (false === $scope.canEditSetsInline) {
               $scope.onCancelSet({set: set});
            }
         }

         // Whoever is linked into this directive
         // has the option to override these actions, or just
         // ignore them entirely.

         $scope.editClicked = function() {
            Promise.when($scope.onEditClicked({workout: $scope.model}))
            .then(function() {
               if (true === $scope.canEditInline) {
                  $scope.setIsEditing(true);
               }
            });
         }

         $scope.deleteClicked = function() {
            Promise.when($scope.onDeleteClicked({workout: $scope.model}))
            .then(function() {

            });
         }

         $scope.saveClicked = function() {
            var previousModel = $scope.model.clone();

            $scope.model.fromModel($scope.editingWorkout);
            Promise.when($scope.onSaveClicked({workout: $scope.model}))
            .then(function() {
               $scope.setIsEditing(false);
            })
            .catch(function() {
               $scope.model.fromModel(previousModel);
            });
         }

         $scope.cancelClicked = function() {
            Promise.when($scope.onCancelClicked({workout: $scope.model}))
            .then(function() {
               $scope.setIsEditing(false);
            });
         }
      }
   };
}]);

module.exports = name;