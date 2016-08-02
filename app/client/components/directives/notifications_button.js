'use strict';

var registerDirective = require('directives/register');

var name = 'notificationsButton';

registerDirective(name, [require('services/scope_service'),
                         require('services/date_service'),
                         require('services/state_service'),
                         '$popover',
                         '$timeout',
function(ScopeService, DateService, StateService, $popover,
$timeout) {
   return {
      restrict: 'E',
      replace: true,
      templateUrl: "directives/notifications_button.html",
      scope: {
         user: "<",
         onPopoverOpen: "&",
         onPopoverClosed: "&"
      },
      link: function($scope, $element, $attributes) {
         var notificationsPopover = $popover($element, {
            trigger: "manual",
            animation: "",
            placement: "bottom",
            autoClose: true,
            templateUrl: "popovers/full/notifications_full.html",
            contentTemplate: "popovers/partials/notifications.html",
            scope: $scope.$new(), // Give the popover access to this scope.
         });

         $scope.getNumberOfNewNotifications = function() {
            return $scope.user.getNewNotifications().length;
         }

         $scope.getNotificationTime = function(notification) {
            return DateService.dateStringToDefaultFormattedString(notification.created_at);
         }

         $scope.notificationHasParentLink = function(notification) {
            var lowerCaseType = notification.type.toLowerCase();
            return notification.parent &&
                   ('question' === lowerCaseType);
         }

         $scope.getNotificationStyle = function(notification, isLast) {
            var style = {};

            if (!isLast) {
               style['border-bottom'] = '1px solid black';
            }

            if (true === notification.is_unread) {
               style['background-color'] = '#e6ffff';
            }

            if (true === $scope.notificationHasParentLink(notification)) {
               style['cursor'] = 'pointer';
            }

            return style;
         }

         $scope.popoverVisible = false;

         function TogglePopover() {
            $scope.popoverVisible = !$scope.popoverVisible;
            notificationsPopover.toggle();

            if ($scope.popoverVisible) {
               $scope.onPopoverOpen();
            } else {
               $scope.onPopoverClosed();
            }
         }

         function HidePopover() {
            $scope.popoverVisible = false;
            notificationsPopover.hide();

            $scope.onPopoverClosed();
         }

         $scope.notificationClicked = function(notification) {
            var lowerCaseType = notification.type.toLowerCase();

            var url = "main." + lowerCaseType + ".default";
            var params = {};
            var paramKey = lowerCaseType + "Id";

            params[paramKey] = notification.parent.id;
            
            HidePopover();
            
            StateService.go(url, params);
         }

         $scope.toggleNotificationsWindow = function() {
            TogglePopover();
         }
      }
   }
}
]);

module.exports = name;