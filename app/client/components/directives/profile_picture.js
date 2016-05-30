'use strict';

var registerDirective = require('directives/register');

var name = 'profilePicture';

registerDirective(name, [require('models/picture'),
function(PictureModel) {
   return {
      restrict: 'E',
      scope: {
         user: "<",
         //width: "@",
         //height: "@"
      },
      templateUrl: "directives/profile_picture.html",
      link: function($scope, $element, $attributes) {
         $scope.width = $attributes.width || null;
         $scope.height = $attributes.height || null;
         
         var defaultPicture = new PictureModel({url: "images/profile_picture_placeholder.jpg"});
         
         $scope.getProfilePicture = function() {
            if (!$scope.user.profile_picture.url) {
               return defaultPicture;
            } else {
               return $scope.user.profile_picture;
            }
         }
      }
   }
}])

module.exports = name;