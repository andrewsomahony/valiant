'use strict';

var registerDirective = require('directives/register');

var name = 'notificationsButton';

registerDirective(name, [require('services/scope_service'),
                         '$popover',
function(ScopeService, $popover) {
   return {
      restrict: 'E',
      replace: true,
      templateUrl: "directives/notifications_button.html",
      scope: {
         user: "<"
      },
      link: function($scope, $element, $attributes) {
         var notificationsScope = ScopeService.newRootScope(true, $scope);

         console.log($element);
         var notificationsPopover = $popover($element, {
            trigger: "manual",
            animation: "",
            placement: "bottom",
            autoClose: true,
            templateUrl: "popovers/full/notifications_full.html",
            contentTemplate: "popovers/partials/notifications.html",
            scope: notificationsScope
         });

         $scope.getNumberOfUnreadNotifications = function() {
            return $scope.user.getUnreadNotifications().length;
         }

         $scope.toggleNotificationsWindow = function() {
            notificationsPopover.toggle();
         }
      }
   }
}
]);

module.exports = name;