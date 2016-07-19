'use strict';

var registerDirective = require('directives/register');

var name = 'userLink';

registerDirective(name, [require('services/scope_service'),
                         '$compile',
function(ScopeService, $compile) {
   return {
      restrict: "E",
      scope: {
         user: "<",
         pictureSize: "@"
      },
      templateUrl: "directives/user_link.html",
      link: function($scope, $element, $attributes) {
         $element.addClass('user-link');
         console.log($scope);
      }
   }
}]);

module.exports = name;