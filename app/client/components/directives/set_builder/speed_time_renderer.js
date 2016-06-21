'use strict';

var registerDirective = require('directives/register');

var utils = require('utils');

var name = 'speedTime';

registerDirective(name, [require('models/set_builder/speed_time'),
                         require('services/scope_service'),
                         '$timeout',
function(SpeedTimeModel, ScopeService, $timeout) {
   return {
      restrict: "E",
      scope: {
         model: "=",
         
         // Why are these commented out?

         // Because if we watch these values,
         // and try to set them to a proper boolean,
         // Angular sometimes overrides them with the original string!
         
         // So, we can still watch them, but we can't have Angular
         // messing around with them

         /*isInterval: "@",
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
      templateUrl: 'directives/set_builder/speed_time_renderer.html',
      link: function($scope, $element, $attributes) {
         $element.addClass('speed-time');

         $scope.hasCheckedInitiallyEditing = false;

         ScopeService.watchBool($scope, $attributes, 'isDetached', false);
         ScopeService.watchBool($scope, $attributes, 'canEditInline', true);
         ScopeService.watchBool($scope, $attributes, 'isInterval', false);
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

            if (true === $scope.canEditInline &&
                false === $scope.isDetached) {
               classes.push('inline');
            }

            return classes;
         }

         $scope.setIsEditing = function(isEditing) {
            $scope.isEditing = isEditing;
            if (true === isEditing) {
               if (!$scope.editingModel) {
                  $scope.editingModel = new SpeedTimeModel();
               }
               $scope.editingModel.fromModel($scope.model);
            }
         }

         $scope.hours = utils.map(utils.loopedIntegerArray(60), function(i) {
            if (i > 0) {
               return utils.numberToString(i);
            } else {
               return null;
            }
         });
         $scope.minutes = utils.map(utils.loopedIntegerArray(60), function(i) {
            if (i > 0) {
               return utils.numberToString(i);
            } else {
               return null;
            }
         });
         $scope.seconds = utils.map(utils.loopedIntegerArray(60), function(i) {
            if (i > 0) {
               return utils.numberToString(i);
            } else {
               return null;
            }
         });

         $scope.getModelString = function() {
            return ($scope.isInterval ? "@" : "") + $scope.model.time.toString();
         }

         $scope.editClicked = function() {
            if (true === $scope.canEditInline) {
               $scope.setIsEditing(true);
            }
            $scope.onEditClicked({speedTime: $scope.model});
         }

         $scope.deleteClicked = function() {
            $scope.onDeleteClicked({speedTime: $scope.model});
         }

         $scope.cancelClicked = function() {
            $scope.setIsEditing(false);
            $scope.onCancelClicked({speedTime: $scope.model});
         }

         $scope.saveClicked = function() {
            $scope.model.fromModel($scope.editingModel);
            $scope.setIsEditing(false);

            $scope.onSaveClicked({speedTime: $scope.model});
         }
      }
   }
}]);

module.exports = name;