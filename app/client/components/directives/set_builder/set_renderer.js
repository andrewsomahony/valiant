'use strict';

var registerDirective = require('directives/register');

var name = 'set';

registerDirective(name, [require('models/set_builder/set'),
                         require('services/scope_service'),
                         require('services/set_builder_service'),
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
      templateUrl: "directives/set_builder/set_renderer.html",
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
            $scope.setIsEditing(false);
            
            $scope.model.fromModel($scope.editingSet);
            $scope.onSaveClicked({set: $scope.model});
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
      }
   };
}])