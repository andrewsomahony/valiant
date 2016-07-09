'use strict';

var registerDirective = require('directives/register');

var name = 'clipboardPaste';

registerDirective(name, [require('services/clipboard_service'),
                         '$compile',
function(ClipboardService, $compile) {
   return {
      restrict: "A",
      scope: {
         clipboardPaste: "=",
         name: "@"
      },
      link: function($scope, $element, $attributes) {
         $scope.paste = function() {
            $scope.clipboardPaste.fromModel(ClipboardService.paste());
         }

         $scope.canPaste = function() {
            return ClipboardService.canPaste($scope.clipboardPaste.$ownClass);
         }

         $scope.getName = function() {
            return "Paste " + $scope.name;
         }

         var $pasteLink = angular.element("<a></a>");
         $pasteLink.attr('ng-click', 'paste()');
         $pasteLink.attr('ng-bind', 'getName()');

         $element.append($compile($pasteLink)($scope));

         $element.attr('ng-if', 'canPaste()');

         $element.removeAttr('clipboard-paste');
         $compile($element)($scope);
      }
   }
}])

module.exports = name;