'use strict';

var registerDirective = require('directives/register');

var name = 'notificationsButton';

registerDirective(name, [require('services/scope_service'),
                         require('services/date_service'),
                         require('services/state_service'),
                         require('services/user_service'),
                         require('services/error_modal'),
                         '$popover',
                         '$timeout',
function(ScopeService, DateService, StateService, UserService, 
ErrorModal, $popover, $timeout) {
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
            onShow: function($popover) {
               $scope.onPopoverOpen();
            },
            onHide: function($popover) {
               $scope.onPopoverClosed();
            }
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
               style['background-color'] = '#ccffff';
            }

            if (true === $scope.notificationHasParentLink(notification)) {
               style['cursor'] = 'pointer';
            }

            return style;
         }

         function TogglePopover() {
            notificationsPopover.toggle();
         }

         function HidePopover() {
            notificationsPopover.hide();
         }

         $scope.notificationClicked = function(notification) {
            // On the notification button click in top_bar.js,
            // we clone the notification array and mark the original
            // as all "old", and then $timeout to allow the interface to recompile.
            
            // That was all for interface responsiveness: we don't need to do that
            // much here, as this goes to a new page.

            UserService.markNotificationsAsRead($scope.user, [notification])
            .then(function() {
               var lowerCaseType = notification.type.toLowerCase();

               var url = "main." + lowerCaseType + ".default";
               var params = {};
               var paramKey = lowerCaseType + "Id";

               params[paramKey] = notification.parent.id;
               
               HidePopover();
               
               StateService.go(url, params);
            })
            .catch(function(error) {
               ErrorModal(error);
            });
         }

         $scope.toggleNotificationsWindow = function() {
            TogglePopover();
         }
      }
   }
}
]);

module.exports = name;