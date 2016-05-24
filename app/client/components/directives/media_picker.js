'use strict';

var registerDirective = require('directives/register');

var name = 'mediaPicker';

registerDirective(name, [
function() {
   return {
      restrict: 'E',
      scope: {
         type: "@",
         model: "="
      },
      templateUrl: "directives/media_picker.html",
      link: function($scope, $element, $attributes) {
         $scope.isPicture = function() {
            return 'picture' === $scope.type;
         }
         $scope.isVideo = function() {
            return 'video' === $scope.type;
         }
      }
   }
}]);

module.exports = name;