'use strict';

var registerDirective = require('directives/register');

var dom_utils = require('dom_utils');

var name = 'workout';

registerDirective(name, [require('models/workout_builder/workout'),
                         require('services/workout_builder_service'),
                         require('services/scope_service'),
                         require('services/promise'),
                         require('services/error'),
                         '$timeout',
function(WorkoutModel, SetBuilderService, ScopeService, Promise,
ErrorService, $timeout) {
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

         //scrollToWhenEdited: "@"
         //canEditSetsInline
         //isInitiallyEditing: "@",
         //isEditable: "@",
         //canEditInline: "@"
      },
      templateUrl: "directives/workout_builder/workout_renderer.html",
      link: function($scope, $element, $attributes) {
         $element.addClass('workout');

         $scope.hasCheckedInitiallyEditing = false;

         $scope.numberOfPendingSetsToBeSaved = 0;

         ScopeService.watchBool($scope, $attributes, 'scrollToWhenEdited', true);
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

         $scope.error = function(e) {
            if (!e) {
               $scope.errorMessage = "";
            } else {
               $scope.errorMessage = e.toString(false);
            }
         }

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

         $scope.newSet = function(index) {
            var set = $scope.editingWorkout.addToChildArrayAtIndex('sets', index);
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

                  if (true === $scope.scrollToWhenEdited) {
                     $timeout(function() {
                        dom_utils.smoothScroll($element[0]);
                     });
                  }
               }
            });
         }

         $scope.deleteClicked = function() {
            Promise.when($scope.onDeleteClicked({workout: $scope.model}))
            .then(function() {

            });
         }

         function CheckPendingSets() {
            return Promise(function(resolve, reject) {
               if (!$scope.numberOfPendingSetsToBeSaved) {
                  $scope.saveWorkout()
                  .then(function() {
                     resolve(true);
                  })
                  .catch(function() {
                     resolve(false);
                  })
               } else {
                  // If we still have pending sets to be saved,
                  // then we say we aren't done yet.
                  resolve(false);
               }
            })
         }

         $scope.saveClicked = function() {
            return Promise(function(resolve, reject) {
               $scope.numberOfPendingSetsToBeSaved = 0;
               $scope.editingWorkout.sets.forEach(function(set) {
                  set.setInternalVariable('save_triggered', true);
                  $scope.numberOfPendingSetsToBeSaved += 1;
               });

               CheckPendingSets()
               .then(function(isDone) {
                  resolve(isDone);
               });
            });
         }

         $scope.saveWorkout = function() {
            return Promise(function(resolve, reject) {
               var previousModel = $scope.model.clone();
               $scope.error(null);

               $scope.model.fromModel($scope.editingWorkout);
               Promise.when($scope.onSaveClicked({workout: $scope.model}))
               .then(function() {
                  $scope.setIsEditing(false);
                  resolve(true);
               })
               .catch(function(error) {
                  console.log(error);
                  $scope.error(error);

                  $scope.model.fromModel(previousModel);
                  reject(error);
               });
            });
         }

         $scope.cancelClicked = function() {
            Promise.when($scope.onCancelClicked({workout: $scope.model}))
            .then(function() {
               $scope.setIsEditing(false);
            });
         }

         $scope.$on('set.save_trigger_handled', function(event) {
            event.stopPropagation();

            $scope.numberOfPendingSetsToBeSaved -= 1;
            CheckPendingSets();
         });
      }
   };
}]);

module.exports = name;