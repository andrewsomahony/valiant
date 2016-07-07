'use strict';

var registerDirective = require('directives/register');

var utils = require('utils');

var name = 'speedTime';

registerDirective(name, [require('models/workout_builder/speed_time'),
                         require('services/scope_service'),
                         require('services/promise'),
                         '$timeout',
function(SpeedTimeModel, ScopeService, Promise, $timeout) {
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
      templateUrl: 'directives/workout_builder/speed_time_renderer.html',
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

         $scope.error = function(e) {
            if (!e) {
               $scope.errorMessage = "";
            } else {
               $scope.errorMessage = e.toString(false);
            }
         }

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
            $scope.model.setInternalVariable('is_editing', isEditing);
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

         $scope.getTimeString = function() {
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
            })
         }

         $scope.saveClicked = function() {
            return Promise(function(resolve, reject) {
               $scope.saveSpeedTime()
               .then(function() {
                  resolve(true);
               })
               .catch(function() {
                  resolve(false);
               });
            })
         }

         $scope.saveSpeedTime = function() {
            return Promise(function(resolve, reject) {
               var previousModel = $scope.model.clone();

               $scope.error(null);

               $scope.model.fromModel($scope.editingModel);
               Promise.when($scope.onSaveClicked({speedTime: $scope.model}))
               .then(function() {
                  $scope.setIsEditing(false);
                  resolve();
               })
               .catch(function(error) {
                  $scope.error(error);
                  
                  $scope.model.fromModel(previousModel);
                  reject(error);
               })
            })            
         }

         function DoneSaving() {
            $scope.model.setInternalVariable('save_triggered', false);
            ScopeService.emitMessage($scope, 
                $scope.isInterval ? 'interval.save_trigger_handled'
                    : 'rest.save_trigger_handled');
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
         });
      }
   }
}]);

module.exports = name;