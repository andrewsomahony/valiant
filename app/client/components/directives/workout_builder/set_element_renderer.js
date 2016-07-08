'use strict';

var registerDirective = require('directives/register');

var dom_utils = require('dom_utils');

var name = 'setElement';

registerDirective(name, [require('models/workout_builder/set_element'),
                         require('services/scope_service'),
                         require('services/workout_builder_service'),
                         require('services/promise'),
                         '$timeout',
function(SetElementModel, ScopeService, SetBuilderService, 
Promise, $timeout) {
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

         //scrollToWhenEdited
      },
      
      templateUrl: "directives/workout_builder/set_element_renderer.html",
      link: function($scope, $element, $attributes) {
         $element.addClass('set-element');

         $scope.hasCheckedInitiallyEditing = false;

         $scope.numberOfPendingModificationsToBeSaved = 0;
         $scope.numberOfPendingRestsToBeSaved = 0;
         $scope.numberOfPendingIntervalsToBeSaved = 0;

         ScopeService.watchBool($scope, $attributes, 'scrollToWhenEdited', true);
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
               if (!$scope.editingElement) {
                  $scope.editingElement = new SetElementModel();
               }
               $scope.editingElement.fromModel($scope.model);
            }
            $scope.model.setInternalVariable('is_editing', isEditing);
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

         function CheckPendingChildElements() {
            return Promise(function(resolve, reject) {
               if (!$scope.numberOfPendingIntervalsToBeSaved &&
                   !$scope.numberOfPendingModificationsToBeSaved &&
                   !$scope.numberOfPendingRestsToBeSaved) {
                  $scope.saveElement()
                  .then(function() {
                     resolve(true);
                  })
                  .catch(function() {
                     resolve(false);
                  })
               } else {
                  resolve(false);
               }
            });           
         }

         $scope.saveClicked = function() {
            return Promise(function(resolve, reject) {
               $scope.numberOfPendingModificationsToBeSaved = 0;
               $scope.editingElement.modifications.forEach(function(modification) {
                  modification.setInternalVariable('save_triggered', true);
                  $scope.numberOfPendingModificationsToBeSaved += 1;
               });

               $scope.numberOfPendingRestsToBeSaved = 0;
               $scope.editingElement.rests.forEach(function(rest) {
                  rest.setInternalVariable('save_triggered', true);
                  $scope.numberOfPendingRestsToBeSaved += 1;
               });
               
               $scope.numberOfPendingIntervalsToBeSaved = 0;
               $scope.editingElement.intervals.forEach(function(interval) {
                  interval.setInternalVariable('save_triggered', true);
                  $scope.numberOfPendingIntervalsToBeSaved += 1;
               });

               CheckPendingChildElements()
               .then(function(isDone) {
                  resolve(isDone);
               });
            })

         }

         $scope.saveElement = function() {
            return Promise(function(resolve, reject) {
               var previousModel = $scope.model.clone();

               $scope.error(null);

               $scope.model.fromModel($scope.editingElement);
               Promise.when($scope.onSaveClicked({element: $scope.model}))
               .then(function() {
                  $scope.setIsEditing(false);
                  resolve();
               })
               .catch(function(error) {
                  $scope.error(error);

                  $scope.model.fromModel(previousModel);
                  reject(error);
               });
            });
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

         $scope.deleteModification = function(modification) {
            $scope.editingElement.deleteFromChildArray('modifications', modification);
         }

         $scope.saveModification = function(modification) {
            modification.setInternalVariable('is_unborn', false);
         }

         $scope.cancelModification = function(modification) {
            if (true === modification.getInternalVariable('is_unborn')) {
               $scope.deleteModification(modification);
            }
         }

         $scope.newModification = function() {
            var modification = $scope.editingElement.pushOntoChildArray('modifications');
            modification.setInternalVariable('is_unborn', true);
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

         function DoneSaving() {
            $scope.model.setInternalVariable('save_triggered', false);
            ScopeService.emitMessage($scope, 'element.save_trigger_handled');
         }         

         $scope.$on('interval.save_trigger_handled', function(event) {
            event.stopPropagation();

            $scope.numberOfPendingIntervalsToBeSaved -= 1;
            CheckPendingChildElements()
            .then(function(isDone) {
               if (true === isDone) {
                  DoneSaving();
               }
            })
         });

         $scope.$on('rest.save_trigger_handled', function(event) {
            event.stopPropagation();

            $scope.numberOfPendingRestsToBeSaved -= 1;
            CheckPendingChildElements()
            .then(function(isDone) {
               if (true === isDone) {
                  DoneSaving();
               }
            })
         });

         $scope.$on('modification.save_trigger_handled', function(event) {
            event.stopPropagation();

            $scope.numberOfPendingModificationsToBeSaved -= 1;
            CheckPendingChildElements()
            .then(function(isDone) {
               if (true === isDone) {
                  DoneSaving();
               }
            })
         });

         $scope.$watch('model.save_triggered', function(newValue, oldValue) {
            if (newValue != oldValue && newValue) {
               $scope.saveTriggered()
               .then(function(isDone) {
                  if (true === isDone) {
                     DoneSaving();
                  }
               });
            }
         })
      }
   }
}])

module.exports = name;