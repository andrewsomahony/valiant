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
            // We make a "new" model that doesn't have
            // an id, created_at, or updated_at overriden
            // by what's on the clipboard.  We don't want clones
            // of the ID, for a start, but as this is a new object,
            // we want it to have its own properties that it either
            // starts with, or gets when it's saved to the server.
            
            $scope.clipboardPaste.newModel(ClipboardService.paste());
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