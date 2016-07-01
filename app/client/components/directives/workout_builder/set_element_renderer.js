'use strict';

var registerDirective = require('directives/register');

var name = 'setElement';

registerDirective(name, [require('models/workout_builder/set_element'),
                         require('services/scope_service'),
                         require('services/workout_builder_service'),
                         '$timeout',
function(SetElementModel, ScopeService, SetBuilderService, $timeout) {
   return {
      restrict: "E",
      scope: {
         model: "=",
         saveButtonText: "@",
         cancelButtonText: "@",

         onCancelClicked: "&",
         onSaveClicked: "&",
         onDeleteClicked: "&",
         onEditClicked: "&",
      },
      
      templateUrl: "directives/workout_builder/set_element_renderer.html",
      link: function($scope, $element, $attributes) {
         $element.addClass('set-element');

         $scope.hasCheckedInitiallyEditing = false;

         ScopeService.watchBool($scope, $attributes, 'isDetached', false);
         ScopeService.watchBool($scope, $attributes, 'canEditInline', false);
         ScopeService.watchBool($scope, $attributes, 'showIntervalsAndRests', true);
         ScopeService.watchBool($scope, $attributes, 'isEditable', true);
         ScopeService.watchBool($scope, $attributes, 'isInitiallyEditing', false, function(newValue) {
            // We only want to run this once.
            if (!$scope.hasCheckedInitiallyEditing) {
               $scope.hasCheckedInitiallyEditing = true;
               if (true === $scope.isInitiallyEditing) {
                  $scope.editClicked();
               }
            }

         })

         $scope.types = 
            SetBuilderService.getSetTypeNamesArray();

         $scope.strokeModifications = 
            SetBuilderService.getSetStrokeModificationNamesArray();

         $scope.strokes = 
            SetBuilderService.getSetStrokeNamesArray();

         $scope.getEditDivClass = function() {
            var classes = [];

            if (true === $scope.canEditInline &&
                false === $scope.isDetached) {
               classes.push('inline');
            }

            return classes;
         }

         $scope.setIsEditing = function(isEditing) {
            $scope.isEditing = isEditing;
            if (true === isEditing) {
               if (!$scope.editingElement) {
                  $scope.editingElement = new SetElementModel();
               }
               $scope.editingElement.fromModel($scope.model);
            }
            $scope.model.setInternalVariable('is_editing', isEditing);
         }

         $scope.saveClicked = function() {
            $scope.model.fromModel($scope.editingElement);
            $scope.onSaveClicked({element: $scope.model});

            $scope.setIsEditing(false);
         }

         $scope.editClicked = function() {
            if (true === $scope.canEditInline) {
               $scope.setIsEditing(true);
            }
            $scope.onEditClicked({element: $scope.model});
         }

         $scope.deleteClicked = function() {
            $scope.onDeleteClicked({element: $scope.model});
         }

         $scope.cancelClicked = function() {
            $scope.setIsEditing(false);
            $scope.onCancelClicked({element: $scope.model});
         }

         $scope.saveSpeedTime = function(speedTime) {
            speedTime.setInternalVariable('is_unborn', false);
         }

         $scope.saveRest = function(speedTime) {
            $scope.saveSpeedTime(speedTime);
         }

         $scope.newRest = function() {
            var rest = $scope.editingElement.pushOntoChildArray('rests');
            rest.setInternalVariable('is_unborn', true);
         }

         $scope.deleteRest = function(speedTime) {
            $scope.editingElement.deleteFromChildArray('rests', speedTime);
         }

         $scope.cancelRest = function(speedTime) {
            if (true === speedTime.getInternalVariable('is_unborn')) {
               $scope.deleteRest(speedTime);
            }            
         }

         $scope.saveInterval = function(speedTime) {
            $scope.saveSpeedTime(speedTime);
         }

         $scope.newInterval = function() {
            var interval = $scope.editingElement.pushOntoChildArray('intervals');
            interval.setInternalVariable('is_unborn', true);
         }

         $scope.deleteInterval = function(speedTime) {
            $scope.editingElement.deleteFromChildArray('intervals', speedTime);
         }

         $scope.cancelInterval = function(speedTime) {
            if (true === speedTime.getInternalVariable('is_unborn')) {
               $scope.deleteInterval(speedTime);
            }
         }

         $scope.getElementQuantityAndDistance = function() {
            return "" + $scope.model.quantity + "x" + $scope.model.distance;
         }

         $scope.getElementStroke = function() {
            var string = "" + $scope.model.stroke;

            if ($scope.model.stroke_modification) {
               string += " (" + $scope.model.stroke_modification + ")";
            }
            return string;                           
         }

         $scope.getElementNotes = function() {
            return "[" + $scope.model.notes + "]";
         }
      }
   }
}])

module.exports = name;