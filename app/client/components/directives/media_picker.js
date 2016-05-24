'use strict';

var registerDirective = require('directives/register');

var name = 'mediaPicker';

registerDirective(name, [
function() {
   return {
      restrict: 'E',
      scope: {
         type: "@",
         model: "=",
         width: "@",
         height: "@",
         size: "@"
      },
      templateUrl: "directives/media_picker.html",
      link: function($scope, $element, $attributes) {
         $scope.width = $scope.width || "200px";
         $scope.height = $scope.height || "200px";
         
         $scope.isPicture = function() {
            return 'picture' === $scope.type;
         }
         $scope.isVideo = function() {
            return 'video' === $scope.type;
         }
         $scope.isYoutube = function() {
            return 'youtube' === $scope.type;
         }
         
         $scope.getRootNoMediaDivStyle = function() {
            return {
               display: 'inline-block',
               width: $scope.width,
               height: $scope.height,
               border: "1px solid black",
               cursor: "pointer"
            }
         }
      }
   }
}]);

module.exports = name;