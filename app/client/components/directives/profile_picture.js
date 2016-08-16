'use strict';

var registerDirective = require('directives/register');

var dom_utils = require('dom_utils');

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

         // Because the media-renderer div compiles itself
         // and therefore overrides any ng- directives on it,
         // we need to do this here.

         $scope.$watch('user.is_admin', function(newValue) {
            if (true === newValue) {
               $element.find('div').addClass('admin');
            } else {
               $element.find('div').removeClass('admin');
            }
         });
      }
   }
}])

module.exports = name;