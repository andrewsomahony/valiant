'use strict';

var registerDirective = require('directives/register');

var name = 'notificationsButton';

registerDirective(name, [require('services/scope_service'),
                         require('services/date_service'),
                         require('services/state_service'),
                         '$popover',
function(ScopeService, DateService, StateService, $popover) {
   return {
      restrict: 'E',
      replace: true,
      templateUrl: "directives/notifications_button.html",
      scope: {
         user: "<"
      },
      link: function($scope, $element, $attributes) {
         var notificationsPopover = $popover($element, {
            trigger: "manual",
            animation: "",
            placement: "bottom",
            autoClose: true,
            templateUrl: "popovers/full/notifications_full.html",
            contentTemplate: "popovers/partials/notifications.html",
            scope: $scope.$new() // Give the popover access to this scope.
         });

         $scope.getNumberOfUnreadNotifications = function() {
            return $scope.user.getUnreadNotifications().length;
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

         $scope.notificationClicked = function(notification) {
            var lowerCaseType = notification.type.toLowerCase();

            var url = "main." + lowerCaseType + ".default";
            var params = {};
            var paramKey = lowerCaseType + "Id";

            params[paramKey] = notification.parent.id;
            
            notificationsPopover.hide();
            
            StateService.go(url, params);
         }

         $scope.toggleNotificationsWindow = function() {
            notificationsPopover.toggle();
         }

         $scope.$watch("getNumberOfUnreadNotifications()", function(newValue, oldValue) {
            if (newValue !== oldValue) {
               console.log("NEW NOTIFICATIONS", newValue);
            }
         });
      }
   }
}
]);

module.exports = name;