'use strict';

var registerDirective = require('directives/register');

var name = 'overlay';

registerDirective(name, [
function() {
   return {
      restrict: "A",
      link: function($scope, $element, $attributes) {
         //$element.css('right', '0px');
         $element.css('margin', '0');
         $element.css('top', '0px');
         $element.css('position', 'absolute');
         
         $scope.$watch($attributes.width, function(value) {
            if (!value) {
               value = "100%";
            }
            $element.css('width', value);
         });
         
         $scope.$watch($attributes.height, function(value) {
            if (!value) {
               value = "100%";
            }
            $element.css('height', value);            
         });
         
         $scope.$watch($attributes.color, function(value) {
            if (!value) {
               value = "#FFFFFF";
            }
            $element.css('background-color', value);
         });
         
         $scope.$watch($attributes.opacity, function(value) {
            if (!value) {
               value = "0.7";
            }
            $element.css('opacity', value);
         })
      }
   }
}
])

module.exports = name;