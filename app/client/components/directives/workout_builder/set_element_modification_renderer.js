'use strict';

var registerDirective = require('directives/register');

var name = 'setElementModification';

registerDirective(name, [require('models/workout_builder/set_element_modification'),
                         require('services/scope_service'),
                         require('services/workout_builder_service'),
function(SetElementModificationModel, ScopeService, WorkoutBuilderService) {
   return {
      restrict: "E",
      scope: {
         model: "=",

         /*
         isEditable: "@",
         isInitiallyEditing: "@",
         canEditInline: "@",*/

         saveButtonText: "@",
         cancelButtonText: "@",

         onSaveClicked: "&",
         onCancelClicked: "&",
         onDeleteClicked: "&",
         onEditClicked: "&"
      },
      templateUrl: "directives/workout_builder/set_element_modification_renderer.html",
      link: function($scope, $element, $attributes) {
         $element.addClass('set-element-modification');

         $scope.hasCheckedInitiallyEditing = false;

         ScopeService.watchBool($scope, $attributes, 'canEditInline', true);
         ScopeService.watchBool($scope, $attributes, 'isEditable', true);
         ScopeService.watchBool($scope, $attributes, 'isInitiallyEditing', false, function(newValue) {
            // We only want to run this once
            if (!$scope.hasCheckedInitiallyEditing) {
               $scope.hasCheckedInitiallyEditing = true;
               if (true === $scope.isInitiallyEditing) {
                  $scope.editClicked();
               }
            }
         });   

         $scope.getEditDivClass = function() {
            var classes = [];

            if (true === $scope.canEditInline) {
               classes.push('inline');
            }

            return classes;
         }

         $scope.getModificationIcon = function() {
            return WorkoutBuilderService.getSetElementModificationIcon($scope.model);
         }

         $scope.getModificationList = function() {
            return WorkoutBuilderService.getSetStrokeModificationNamesArray();
         }

         $scope.setIsEditing = function(isEditing) {
            $scope.isEditing = isEditing;
            if (true === isEditing) {
               if (!$scope.editingModel) {
                  $scope.editingModel = new SetElementModificationModel();
               }
               $scope.editingModel.fromModel($scope.model);
            }
            $scope.model.setInternalVariable('is_editing', isEditing);
         }

         $scope.editClicked = function() {
            if (true === $scope.canEditInline) {
               $scope.setIsEditing(true);
            }
            $scope.onEditClicked({modification: $scope.model});
         }

         $scope.deleteClicked = function() {
            $scope.onDeleteClicked({modification: $scope.model});
         }

         $scope.cancelClicked = function() {
            $scope.setIsEditing(false);
            $scope.onCancelClicked({modification: $scope.model});
         }

         $scope.saveClicked = function() {
            $scope.model.fromModel($scope.editingModel);
            $scope.setIsEditing(false);

            $scope.onSaveClicked({modification: $scope.model});
         }            
      }
   }
}])

module.exports = name;