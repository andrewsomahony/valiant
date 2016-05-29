'use strict';

var registerDirective = require('directives/register');

var name = 'mediaPicker';

registerDirective(name, [require('services/scope_service'),
function(ScopeService) {
   return {
      restrict: 'E',
      scope: {
         type: "@",
         model: "=",
         width: "@",
         height: "@",
         size: "@",
         mediaContainerWidth: "@",
         mediaContainerHeight: "@",
        // isReadOnly: "@"
      },
      templateUrl: "directives/media_picker.html",
      link: function($scope, $element, $attributes) {
         $scope.width = $scope.width || "200px";
         $scope.height = $scope.height || "200px";
         
         $scope.mediaContainerWidth = $scope.mediaContainerWidth || "300px";
         $scope.mediaContainerHeight = $scope.mediaContainerHeight || "300px";
         
         $scope.isReadOnly = ScopeService.parseBool($attributes.isReadOnly, false);
         
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
            var style = {
               display: 'inline-block',
               width: $scope.width,
               height: $scope.height,
               border: "1px solid black"
            };
                        
            if (true === $scope.isReadOnly) {
               style['cursor'] = 'default';
            } else {
               style['cursor'] = 'pointer';
            }
            
            return style;
         }
      }
   }
}]);

module.exports = name;