'use strict';

var registerDirective = require('directives/register');

var name = 'workoutWidget';

registerDirective(name, ['$compile',
                         require('services/scope_service'),
                         require('services/state_service'),
                         require('services/workout_builder_service'),
function($compile, ScopeService, StateService, WorkoutBuilderService) {
   return {
      restrict: "A",
      scope: {
         workout: "<",
         size: "@",
         //isLink: "@"
      },
      link: function($scope, $element, $attributes) {
         $element.addClass('workout-widget');

         ScopeService.watchBool($scope, $attributes,
          'isLink', false);

         $scope.$watch('size', function(newValue) {
            if (!newValue) {
               $scope.size = '250px';
            }
         })

         $scope.getWidgetStyle = function() {
            var style = {};

            style['width'] = $scope.size;
            style['height'] = $scope.size;
            style['font-size'] = parseInt($scope.size) * 0.7;

            return style;
         }

         $scope.getWidgetClass = function() {
            var classes = [];
            
            if (true === $scope.isLink) {
               classes.push('link');
            }

            return classes;
         }

         $scope.onWidgetClicked = function() {
            if (true === $scope.isLink) {
               StateService.go('main.workout_builder', {workoutId: $scope.workout.id});
            }
         }

         var $titleDiv = angular.element("<div></div>");
         $titleDiv.addClass("title");

         var $titleDivSpan = angular.element("<span></span>");
         $titleDivSpan.attr('ng-bind', 'workout.name');

         $titleDiv.append($compile($titleDivSpan)($scope));
         $element.append($compile($titleDiv)($scope));

         var $distanceDiv = angular.element("<div></div>");
         $distanceDiv.addClass("description");

         var $distanceDivPadding = angular.element("<span></span>");
         $distanceDivPadding.addClass('padding');

         $distanceDiv.append($compile($distanceDivPadding)($scope));

         var $distanceDivTextDiv = angular.element("<div></div>");
         $distanceDivTextDiv.addClass('text-container');

         var $distanceDivSpan = angular.element("<span></span>");
         $distanceDivSpan.addClass('distance');
         $distanceDivSpan.attr('ng-bind', 'workout.getTotalDistance()');

         $distanceDivTextDiv.append($compile($distanceDivSpan)($scope));
        
         $distanceDivTextDiv.append(angular.element("<br />"));

         var $workoutStrokeSpan = angular.element("<span></span>");
         $workoutStrokeSpan.addClass('stroke');

         $workoutStrokeSpan.attr('workout-icons', 'workout');
         $workoutStrokeSpan.attr('size', '2em');

         $distanceDivTextDiv.append($compile($workoutStrokeSpan)($scope));

         $distanceDiv.append($compile($distanceDivTextDiv)($scope));

         $element.append($compile($distanceDiv)($scope));

         $element.attr('ng-style', 'getWidgetStyle()');
         $element.attr('ng-class', 'getWidgetClass()');
         $element.attr('ng-click', 'onWidgetClicked()');

         $element.removeAttr('workout-widget');
         $compile($element)($scope);
      }
   }
}])

module.exports = name;