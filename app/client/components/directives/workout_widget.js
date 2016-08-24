'use strict';

var registerDirective = require('directives/register');

var name = 'workoutWidget';

registerDirective(name, ['$compile',
                         require('services/scope_service'),
                         require('services/state_service'),
                         require('services/workout_builder_service'),
                         '$parse',
                         '$timeout',
function($compile, ScopeService, StateService, WorkoutBuilderService,
$parse, $timeout) {
   return {
      restrict: "E",
      scope: {
         workout: "<",
         size: "@",
         //hasHoverOptionsOverlay: "@",
         //canDelete: "@",
         //canView: "@",
         onDelete: "&",
         onView: "&",
         //isLink: "@"
      },
      //replace: true,
      templateUrl: "directives/workout_widget.html",
      compile: function($element, $attributes) {
         return {
            post: link
         }
      }
   };
   function link($scope, $element, $attributes) {

      // For some reason, when we use a template
      // as opposed to generating the DOM ourselves,
      // the workout-icons directive at the bottom messes
      // up a ghost element (a span to vertically center everything)
      // and we don't get proper rendering.  Therefore, we have to kinda
      // hack a different solution in using absolute positioning and centering
      // with margins.

      ScopeService.watchBool($scope, $attributes, 'isLink', false);

      ScopeService.watchBool($scope, $attributes, "hasHoverOptionsOverlay", false);
      ScopeService.watchBool($scope, $attributes, 'canDelete', false);
      ScopeService.watchBool($scope, $attributes, 'canView', false);

      $scope.$watch('size', function(newValue) {
         if (!newValue) {
            $scope.size = '250px';
         }
      })

      $scope.getWidgetStyle = function() {
         var style = {};

         style['width'] = $scope.size;
         style['height'] = $scope.size;
         style['font-size'] = (parseInt($scope.size) * 0.09) + "px";

         return style;
      }

      $scope.getWidgetClass = function() {
         var classes = [];

         classes.push('workout-widget');
         if (true === $scope.isLink) {
            classes.push('link');
         }

         return classes;
      }

      // A stupid hack to sort of center the
      // distance and icons vertically within the widget,
      // as we can't do it with the ghost span method :-/

      $scope.getTextContainerStyle = function() {
         var style = {};

         var icons = WorkoutBuilderService.getWorkoutIcons($scope.workout);

         if (icons.length > 8) {
            style['height'] = '70%';
         } else if (icons.length > 4) {
            style['height'] = '60%';
         } else {
            style['height'] = '50%';
         }

         return style;
      }

      $scope.onWidgetClicked = function() {
         if (true === $scope.isLink) {
            StateService.go('main.workout_builder', {workoutId: $scope.workout.id});
         }
      }

      $scope.onWidgetViewClicked = function() {
         $scope.onView({workout: $scope.workout});
      }

      $scope.onWidgetDeleteClicked = function() {
         $scope.onDelete({workout: $scope.workout});
      }
   }
}]);

module.exports = name;
