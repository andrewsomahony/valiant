'use strict';

var registerDirective = require('directives/register');

var dom_utils = require('dom_utils');

var name = 'set';

registerDirective(name, [require('models/workout_builder/set'),
                         require('services/scope_service'),
                         require('services/workout_builder_service'),
                         require('services/promise'),
                         require('services/clipboard_service'),
                         '$timeout',
function(SetModel, ScopeService, WorkoutBuilderService,
Promise, ClipboardService, $timeout) {
   return {
      restrict: 'E',
      scope: {
         model: "=",
         saveButtonText: "@",
         cancelButtonText: "@",
         onSaveClicked: "&",
         onEditClicked: "&",
         onCancelClicked: "&",
         onDeleteClicked: "&",
         
         //scrollToWhenEdited: "@"
         //showTotalWhenNotEditing: "@"
         //canEditInline: "@",
         //isEditable: "@",
         //isInitiallyEditing: "@"
      },
      templateUrl: "directives/workout_builder/set_renderer.html",
      link: function($scope, $element, $attributes) {
         $element.addClass('set');

         $scope.hasCheckedInitiallyEditing = false;

         $scope.numberOfPendingElementsToBeSaved = 0;

         ScopeService.watchBool($scope, $attributes, 'scrollToWhenEdited', true);
         ScopeService.watchBool($scope, $attributes, 'isDetached', false);
         ScopeService.watchBool($scope, $attributes, 'showTotalWhenNotEditing', false);
         ScopeService.watchBool($scope, $attributes, 'canEditInline', false);
         ScopeService.watchBool($scope, $attributes, 'isEditable', true);
         
         // We call a $timeout here so that all the variables we need are
         // already in place when we want to start manipulating the DOM
         // with editClicked.
         
         ScopeService.watchBool($scope, $attributes, 'isInitiallyEditing', false);
         $timeout(function() {
             if (true === $scope.isInitiallyEditing) {
                 $scope.editClicked();
             }
         });

         $scope.error = function(e) {
            if (!e) {
               $scope.errorMessage = "";
            } else {
               $scope.errorMessage = e.toString(false);
            }
         }

         $scope.setIsEditing = function(isEditing) {
            $scope.isEditing = isEditing;
            if (isEditing) {
               if (!$scope.editingSet) {
                  $scope.editingSet = new SetModel();
               }
               $scope.editingSet.fromModel($scope.model);
            }
            $scope.model.setInternalVariable('is_editing', isEditing);
         }

         $scope.editClicked = function() {
            if (true === $scope.canEditInline ||
                true === $scope.isDetached) {
               $scope.setIsEditing(true);
               if (true === $scope.scrollToWhenEdited) {
                  $timeout(function() {
                     dom_utils.smoothScroll($element[0]);
                  });
               }
            }
            $scope.onEditClicked({set: $scope.model});
         }

         $scope.cancelClicked = function() {
            $scope.setIsEditing(false);
            $scope.onCancelClicked({set: $scope.model});
         }

         $scope.saveTriggered = function() {
            return Promise(function(resolve, reject) {
               if (!$scope.isEditing) {
                  resolve(true);
               } else {
                  $scope.saveClicked()
                  .then(function(isDone) {
                     resolve(isDone);
                  });
               }
            });
         }

         function CheckPendingElements() {
            return Promise(function(resolve, reject) {
               if (!$scope.numberOfPendingElementsToBeSaved) {
                  $scope.saveSet()
                  .then(function() {
                     resolve(true);
                  })
                  .catch(function() {
                     resolve(false);
                  })
               } else {
                  resolve(false);
               }
            })
         }

         $scope.saveClicked = function() {
            return Promise(function(resolve, reject) {              
               $scope.numberOfPendingElementsToBeSaved = 0;
               $scope.editingSet.elements.forEach(function(element) {
                  element.setInternalVariable('save_triggered', true);
                  $scope.numberOfPendingElementsToBeSaved += 1;
               });

               CheckPendingElements()
               .then(function(isDone) {
                  resolve(isDone);
               })
            });
         }

         $scope.saveSet = function() {
            return Promise(function(resolve, reject) {
               var previousModel = $scope.model.clone();
               
               $scope.error(null);

               $scope.model.fromModel($scope.editingSet);
               Promise.when($scope.onSaveClicked({set: $scope.model}))
               .then(function() {
                  $scope.setIsEditing(false);
                  resolve();
               })
               .catch(function(error) {
                  $scope.error(error);

                  $scope.model.fromModel(previousModel);
                  reject(error);
               });               
            })
         }

         $scope.deleteClicked = function() {
             $scope.onDeleteClicked({set: $scope.model});
         }

         $scope.newSetElement = function(index) {
            var newModel = $scope.editingSet.addToChildArrayAtIndex('elements', index);
            newModel.setInternalVariable('is_unborn', true);
         }

         $scope.saveSetElement = function(element) {
            element.setInternalVariable('is_unborn', false);
         }

         $scope.deleteSetElement = function(element) {
            $scope.editingSet.deleteFromChildArray('elements', element);
         }

         $scope.cancelSetElement = function(element) {
            if (true === element.getInternalVariable('is_unborn')) {
               $scope.deleteSetElement(element);
            }
         }

         $scope.getSetTotal = function() {
            return WorkoutBuilderService.formatSetTotalString($scope.editingSet.getTotalDistance());
         }

         $scope.getSetQuantity = function() {
            return WorkoutBuilderService.formatQuantityString($scope.model.quantity);
         }
         $scope.getSetNotes = function() {
            return WorkoutBuilderService.formatNotesString($scope.model.notes);
         }

         $scope.getEditDivClass = function() {
            var classes = [];

            if (true === $scope.canEditInline &&
                false === $scope.isDetached) {
               classes.push('inline');
            }

            return classes;
         }

         function DoneSaving() {
            $scope.model.setInternalVariable('save_triggered', false);
            ScopeService.emitMessage($scope, 'set.save_trigger_handled');
         }

         $scope.$on('element.save_trigger_handled', function(event) {
            event.stopPropagation();

            $scope.numberOfPendingElementsToBeSaved -= 1;

            CheckPendingElements()
            .then(function(isDone) {
               if (true === isDone) {
                  DoneSaving();
               }
            })
         });

         $scope.$watch('model.save_triggered', function(newValue, oldValue) {
             if (newValue != oldValue && newValue) {
                 // The parent workout has told us to save
                // whatever we have pending, and tell them when it's done

                $scope.saveTriggered()
                .then(function(isDone) {
                   if (true === isDone) {
                     DoneSaving();
                   }
                });
             }
         })
      }
   };
}])