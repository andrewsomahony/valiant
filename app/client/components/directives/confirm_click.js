'use strict';

var registerDirective = require('directives/register');

var name = 'confirmClick';

registerDirective(name, [require('services/confirm_modal_service'),
                         require('services/scope_service'),
                         '$compile',
                         '$parse',
function(ConfirmModalService, ScopeService, $compile, $parse) {
   return {
      restrict: "A",
      /*scope: {
         confirmClick: "&",
         confirmMessage: "@"
      },*/
      link: function($scope, $element, $attributes) {
         var $newScope = ScopeService.newScope($scope);

         $newScope.onClick = $parse($attributes.confirmClick);

         $newScope.onConfirmClick = function() {
            ConfirmModalService($newScope.message)
            .then(function(yes) {
               if (yes) {
                  $newScope.onClick($scope);
               }
            });
         }
         
         $attributes.$observe('confirmMessage', function(m) {
            $newScope.message = m;
         
            $element.attr('ng-click', 'onConfirmClick()');
            
            $element.removeAttr('confirm-click');
            $compile($element)($newScope);
         });
      }
   }
}]);

module.exports = name;