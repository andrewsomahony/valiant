'use strict';

var registerDirective = require('directives/register');

var name = 'confirmClick';

registerDirective(name, [require('services/confirm_modal_service'),
                         '$compile',
function(ConfirmModalService, $compile) {
   return {
      restrict: "A",
      scope: {
         confirmClick: "&",
         confirmMessage: "@"
      },
      link: function($scope, $element, $attributes) {
         $scope.onConfirmClick = function() {
            ConfirmModalService($scope.confirmMessage)
            .then(function(yes) {
               if (yes) {
                  $scope.confirmClick();
               }
            });
         }
         
         $element.attr('ng-click', 'onConfirmClick()');
         
         $element.removeAttr('confirm-click');
         $compile($element)($scope);
      }
   }
}]);

module.exports = name;