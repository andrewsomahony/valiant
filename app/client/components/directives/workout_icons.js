'use strict';

var registerDirective = require('directives/register');

var name = 'workoutIcons';

registerDirective(name, ['$compile',
                         require('services/workout_builder_service'),
function($compile, WorkoutBuilderService) {
   return {
      restrict: "A",
      scope: {
         workoutIcons: "<",
         size: "@"
      },
      link: function($scope, $element, $attributes) {
         $element.addClass('workout-icons');

         $scope.$watch('size', function(newValue) {
            if (!newValue) {
               $scope.size = '30px';
            }
         });

         $scope.getImageStyle = function() {
            var style = {};

            style['width'] = $scope.size;
            style['height'] = $scope.size;
            style['margin-right'] = '0.2em';

            return style;
         }

         $scope.$watch('workoutIcons', function(newValue, oldValue) {
            $element.empty();
            
            var strokeIcons = WorkoutBuilderService.getWorkoutIcons($scope.workoutIcons);
            strokeIcons.forEach(function(icon) {
               var $workoutStrokeImage = angular.element("<img />");
               $workoutStrokeImage.attr('ng-src', icon);
               $workoutStrokeImage.attr('ng-style', 'getImageStyle()');

               $element.append($compile($workoutStrokeImage)($scope));
            });

            $element.removeAttr('workout-icons');
            $compile($element)($scope);
         }, true);

      }
   }
}]);

module.exports = name;