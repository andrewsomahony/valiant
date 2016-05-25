'use strict';

var registerDirective = require('directives/register');

var name = 'overlay';

registerDirective(name, [
function() {
   return {
      restrict: "A",
      scope: {
         color: "@",
         width: "@",
         height: "@",
         opacity: "@"
      },
      link: function($scope, $element, $attributes) {
         $scope.color = $scope.color || '#FFFFFF';
         $scope.width = $scope.width || '100%';
         $scope.height = $scope.height || '100%';
         $scope.opacity = $scope.opacity || '0.7';
         
         $element.css('background-color', $scope.color);
         $element.css('opacity', $scope.opacity);
         $element.css('right', '0px');
         $element.css('width', $scope.width);
         $element.css('height', $scope.height);
         $element.css('margin', '0');
         $element.css('top', '0px');
         $element.css('position', 'absolute');
      }
   }
}
])

module.exports = name;