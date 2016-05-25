'use strict';

var registerDirective = require('directives/register');

var name = 'profilePicture';

registerDirective(name, [require('models/user'),
require('services/progress'),
function(UserModel, Progress) {
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
               
         $scope.getDivStyle = function() {
            var style = {};
            
            if ($scope.width) {
               style['width'] = $scope.width;
            }
            style['height'] = "auto";
            
            style['vertical-align'] = 'middle';
            style['position'] = 'relative';
            
            return style;
         }
         
         $scope.getImageStyle = function() {
            return {
               "width": "100%",
               "height": "100%"
            };
         }
         
         $scope.getUrl = function() {
            if (!$scope.user.profile_picture.url) {
               return "images/profile_picture_placeholder.jpg";
            } else {
               return $scope.user.profile_picture.url;
            }
         }
      }
   }
}])

module.exports = name;