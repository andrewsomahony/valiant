'use strict';

var registerDirective = require('directives/register');

var name = 'clipboardCopyLink';

registerDirective(name, [require('services/clipboard_service'),
                         '$compile',
function(ClipboardService, $compile) {
   return {
      restrict: "A",
      scope: {
         clipboardCopyLink: "<"
      },
      link: function($scope, $element, $attributes) {
         $scope.getContent = function() {
            if (true === ClipboardService.hasModel($scope.clipboardCopyLink)) {
               return "(Copied)";
            } else {
               return "Copy";
            }
         }

         $scope.copyModel = function() {
            ClipboardService.copy($scope.clipboardCopyLink);
         }

         $element.attr('ng-bind', 'getContent()');
         $element.attr('ng-click', 'copyModel()');

         $element.removeAttr('clipboard-copy-link');
         $compile($element)($scope);
      }
   }
}]);

module.exports = name;