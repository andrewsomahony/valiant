'use strict';

var registerDirective = require('directives/register');

var name = 'profilePicture';

registerDirective(name, [require('models/user'),
function(UserModel) {
   return {
      restrict: 'E',
      scope: {
         user: "<",
         //width: "@",
         //height: "%@"
      },
      templateUrl: "directives/profile_picture.html",
      link: function($scope, $element, $attributes) {
         $scope.width = $attributes.width || null;
         $scope.height = $attributes.height || null;
               
         $scope.getDivStyle = function() {
            var style = {};
            
            if ($scope.width) {
               style['max-width'] = $scope.width;
            }
            if ($scope.height) {
               style['height'] = "auto";
            }
            
            return style;
         }
         
         $scope.getImageStyle = function() {
            return {
               "width": "100%",
               "height": "100%"
            };
         }
         
         $scope.getUrl = function() {
            if (!$scope.user.profile_picture_url) {
               return "images/profile_picture_placeholder.jpg";
            } else {
               return $scope.user.profile_picture_url;
            }
         }
      }
   }
}])

module.exports = name;