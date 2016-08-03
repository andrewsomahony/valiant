'use strict';

var registerDirective = require('directives/register');

var name = 'fontAwesomeIconText';

registerDirective(name, ['$compile',
function($compile) {
   return {
      restrict: "A",
      scope: {
         icon: "@",
         text: "@"
      },
      link: function($scope, $element, $attributes) {
         $element.addClass('font-awesome-icon-text');

         var $iconSpan = angular.element("<span></span>");
         $iconSpan.addClass('icon');
         $iconSpan.addClass('fa');

         $iconSpan.attr('ng-class', 'icon');

         $element.append($iconSpan);

         var $textSpan = angular.element("<span></span>");
         $textSpan.addClass('text');
         $textSpan.attr('ng-if', 'text');
         $textSpan.attr('ng-bind', 'text');

         $element.append($textSpan);

         $element.removeAttr('font-awesome-icon-text');
         $compile($element)($scope);
      }
   }
}
])