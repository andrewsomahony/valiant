'use strict';

var registerDirective = require('directives/register');

var name = 'fontAwesomeCenteredIcon';

registerDirective(name, ['$compile',
function($compile) {
   return {
      restrict: 'A',
      scope: {
         fontAwesomeParams: "@" 
      },
      link: function($scope, $element, $attributes) {
         $scope.getIconClass = function() {
            return $scope.fontAwesomeParams;
         }
         
         $element.addClass('font-awesome-centered-icon');
         
         var $spanElement = angular.element("<span></span>");
         $spanElement.addClass("padding");
         
         $element.append($spanElement);
         
         var $iconElement = angular.element("<i></i>");
         $iconElement.attr('ng-class', 'getIconClass()');
         
         $element.append($compile($iconElement)($scope));
      }
   }
}
]);

module.exports = name;