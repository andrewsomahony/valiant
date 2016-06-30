'use strict';

var registerDirective = require('directives/register');

var name = 'workoutWidget';

registerDirective(name, ['$compile',
function($compile) {
   return {
      restrict: "A",
      scope: {
         workout: "<",
         size: "@"
      },
      link: function($scope, $element, $attributes) {
         $element.addClass('workout-widget');

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

            return classes;
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

         var $workoutStrokeImage = angular.element("<img />");
         $workoutStrokeImage.attr('src', '/images/freestyle.jpg');

         $workoutStrokeSpan.append($compile($workoutStrokeImage)($scope));
         
         $workoutStrokeImage = angular.element("<img />");
         $workoutStrokeImage.attr('src', '/images/freestyle.jpg');

         $workoutStrokeSpan.append($compile($workoutStrokeImage)($scope));

         $distanceDivTextDiv.append($compile($workoutStrokeSpan)($scope));

         $distanceDiv.append($compile($distanceDivTextDiv)($scope));

         $element.append($compile($distanceDiv)($scope));

         $element.attr('ng-style', 'getWidgetStyle()');
         $element.attr('ng-class', 'getWidgetClass()');

         $element.removeAttr('workout-widget');
         $compile($element)($scope);
      }
   }
}])

module.exports = name;