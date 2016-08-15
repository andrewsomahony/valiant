'use strict';

var registerDirective = require('directives/register');

var name = 'profilePicture';

registerDirective(name, [require('models/picture'),
                         require('services/scope_service'),
                         '$compile',
function(PictureModel, ScopeService, $compile) {
   return {
      restrict: 'E',
      scope: {
         user: "<",
         width: "@",
         height: "@",
         //showUploading: "@",
         //fitted: "@",
         //centered: "@",
         maxHeight: "@"
      },
      templateUrl: "directives/profile_picture.html",
      link: function($scope, $element, $attributes) {
         var defaultPicture = new PictureModel({url: "images/profile_picture_placeholder.jpg"});
         
         ScopeService.watchBool($scope, $attributes, 'showUploading', false);
         ScopeService.watchBool($scope, $attributes, 'fitted', false);
         ScopeService.watchBool($scope, $attributes, 'centered', false);

         $scope.getProfilePicture = function() {
            if (!$scope.user.profile_picture.url) {
               return defaultPicture;
            } else {
               return $scope.user.profile_picture;
            }
         }

         $scope.getProfilePictureStyle = function() {
            var style = {};

            style['display'] = 'inline-block';
            if (true === $scope.fitted) {
               style['width'] = '100%';
               style['height'] = '100%';
            }
            return style;
         }
      }
   }
}])

module.exports = name;