'use strict';

var registerDirective = require('directives/register');

var name = 'setElementModification';

registerDirective(name, [require('models/workout_builder/set_element_modification'),
                         require('services/scope_service'),
                         require('services/workout_builder_service'),
                         require('services/promise'),
                         '$timeout',
function(SetElementModificationModel, ScopeService, WorkoutBuilderService,
Promise, $timeout) {
   return {
      restrict: "E",
      scope: {
         model: "=",

         /*
         isEditable: "@",
         isInitiallyEditing: "@",
         canEditInline: "@",*/

         //scrollToWhenEdited

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

         ScopeService.watchBool($scope, $attributes, 'scrollToWhenEdited', true);
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

         $scope.error = function(e) {
            if (!e) {
               $scope.errorMessage = "";
            } else {
               $scope.errorMessage = e.toString(false);
            }
         }

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

         $scope.formatModificationName = function(model) {
            var returnString = "";

            returnString += model.name;
            if (model.is_optional) {
               returnString += " (Optional)";
            } 
            
            return returnString;
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
               if (true === $scope.scrollToWhenEdited) {
                  $timeout(function() {
                     dom_utils.smoothScroll($element[0]);
                  });
               }
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

         $scope.saveClicked = function() {
            return Promise(function(resolve, reject) {
               $scope.saveModification()
               .then(function() {
                  resolve(true);
               })
               .catch(function() {
                  resolve(false);
               })
            })
         } 

         $scope.saveModification = function() {
            return Promise(function(resolve, reject) {
               var previousModel = $scope.model.clone();

               $scope.error(null);

               $scope.model.fromModel($scope.editingModel);
               Promise.when($scope.onSaveClicked({modification: $scope.model}))
               .then(function() {
                  $scope.setIsEditing(false);
                  resolve();
               })
               .catch(function(error) {
                  $scope.error(error);
                  
                  $scope.model.fromModel(previousModel);
                  reject(error);
               })
            });
         }

         function DoneSaving() {
            $scope.model.setInternalVariable('save_triggered', false);
            ScopeService.emitMessage($scope, 'modification.save_trigger_handled');
         }

         $scope.$watch('model.save_triggered', function(newValue, oldValue) {
            if (newValue != oldValue && newValue) {
               $scope.saveTriggered()
               .then(function(isDone) {
                  if (true === isDone) {
                     DoneSaving();
                  }
               })
            }
         })           
      }
   }
}])

module.exports = name;