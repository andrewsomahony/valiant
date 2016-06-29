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

         $scope.getWidgetStyle = function() {
            var style = {};

            if ($scope.size) {
               style['width'] = $scope.size;
               style['height'] = $scope.size;
            } else {
               style['width'] = '250px';
               style['height'] = '250px';
            }
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
         $distanceDiv.addClass("distance");

         var $distanceDivPadding = angular.element("<span></span>");
         $distanceDivPadding.addClass('padding');

         $distanceDiv.append($compile($distanceDivPadding)($scope));

         var $distanceDivSpan = angular.element("<span></span>");
         $distanceDivSpan.attr('ng-bind', 'workout.getTotalDistance()');

         $distanceDiv.append($compile($distanceDivSpan)($scope));
         $element.append($compile($distanceDiv)($scope));

         $element.attr('ng-style', 'getWidgetStyle()');
         $element.attr('ng-class', 'getWidgetClass()');

         $element.removeAttr('workout-widget');
         $compile($element)($scope);
      }
   }
}])

module.exports = name;