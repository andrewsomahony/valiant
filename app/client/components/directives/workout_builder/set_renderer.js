'use strict';

var registerDirective = require('directives/register');

var name = 'set';

registerDirective(name, [require('models/workout_builder/set'),
                         require('services/scope_service'),
                         require('services/workout_builder_service'),
function(SetModel, ScopeService, SetBuilderService) {
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
         
         //showTotalWhenNotEditing: "@"
         //canEditInline: "@",
         //isEditable: "@",
         //isInitiallyEditing: "@"
      },
      templateUrl: "directives/workout_builder/set_renderer.html",
      link: function($scope, $element, $attributes) {
         $element.addClass('set');

         $scope.hasCheckedInitiallyEditing = false;

         ScopeService.watchBool($scope, $attributes, 'isDetached', false);
         ScopeService.watchBool($scope, $attributes, 'showTotalWhenNotEditing', false);
         ScopeService.watchBool($scope, $attributes, 'canEditInline', false);
         ScopeService.watchBool($scope, $attributes, 'isEditable', true);
         ScopeService.watchBool($scope, $attributes, 'isInitiallyEditing', false, function(newValue) {
            if (!$scope.hasCheckedInitiallyEditing) {
               $scope.hasCheckedInitiallyEditing = true;
               if (true === $scope.isInitiallyEditing) {
                  $scope.editClicked();
               }
            }
         });

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
            }
            $scope.onEditClicked({set: $scope.model});
         }

         $scope.cancelClicked = function() {
            $scope.setIsEditing(false);
            $scope.onCancelClicked({set: $scope.model});
         }

         $scope.saveClicked = function() {
            var previousModel = $scope.model.clone();
            
            $scope.setIsEditing(false);
            $scope.model.fromModel($scope.editingSet);

            Promise.when($scope.onSaveClicked({set: $scope.model}))
            .then(function() {
                $scope.setIsEditing(false);
            })
            .catch(function(error) {
                $scope.model.fromModel(previousModel);
            });
            
            //$scope.onSaveClicked({set: $scope.model});
         }

         $scope.deleteClicked = function() {
             $scope.onDeleteClicked({set: $scope.model});
         }

         $scope.newSetElement = function() {
            var newModel = $scope.editingSet.pushOntoChildArray('elements');
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
            return SetBuilderService.formatSetTotalString($scope.editingSet.getTotalDistance());
         }

         $scope.getSetQuantity = function() {
            return SetBuilderService.formatQuantityString($scope.model.quantity);
         }
         $scope.getSetNotes = function() {
            return SetBuilderService.formatNotesString($scope.model.notes);
         }

         $scope.getEditDivClass = function() {
            var classes = [];

            if (true === $scope.canEditInline &&
                false === $scope.isDetached) {
               classes.push('inline');
            }

            return classes;
         }

         $scope.$watch('model.save_triggered', function(newValue, oldValue) {
             if (newValue && newValue != oldValue) {
                // The parent workout has told us to save
                // whatever we have pending, and tell them when it's done

                $scope.saveClicked();
                ScopeService.emitMessage($scope, 'set.save_trigger_handled');
             }
         })
      }
   };
}])