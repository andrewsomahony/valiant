'use strict';

var registerDirective = require('directives/register');

var name = 'notification';

registerDirective(name, [require('services/date_service'),
                         require('services/scope_service'),
function(DateService, ScopeService) {
   return {
      restrict: "E",
      scope: {
         notification: "<model",
         onClicked: "&",
         isLast: "@"
      },
      templateUrl: "directives/notification.html",
      link: function($scope, $element, $attributes) {
         // !!! Groan...
         // The notification should be independent of where it's being
         // used...but isLast is needed for the style.

         ScopeService.watchBool($scope, $attributes, 'isLast', false);

         $scope.clicked = function() {
            $scope.onClicked({notification: $scope.notification});
         }

         $scope.getStyle = function() {
            var style = {};

            if (!$scope.isLast) {
               style['border-bottom'] = '1px solid black';
            }

            if (true === $scope.notification.is_unread) {
               style['background-color'] = '#ccffff';
            }

            if (true === $scope.notificationHasParentLink()) {
               style['cursor'] = 'pointer';
            }

            return style;
         }

         $scope.getNotificationTime = function() {
            return DateService.dateStringToDefaultFormattedString(
               $scope.notification.created_at);
         }

         $scope.notificationHasParentLink = function() {
            var lowerCaseType = $scope.notification.type.toLowerCase();
            return $scope.notification.parent &&
                   ('question' === lowerCaseType);
         }
      }
   };
}
]);

module.exports = name;
