'use strict';

var registerDirective = require('directives/register');

var name = 'pictureMediaPicker';

registerDirective(name, [require('services/picture_proportional_resize_service'),
                         require('services/picture_service'),
function(PictureProportionalResizeService, PictureService) {
   return {
      // We just want to use our parent's scope,
      // so we inherit the model variable
      // that we can manipulate
      
      restrict: "E",
      scope: false,
      templateUrl: "directives/picture_media_picker.html",
      link: function($scope, $element, $attribues) {
         var maxPictureWidth = 800; 
                
         $scope.getHasMediaDivStyle = function() {
            return {
               width: $scope.mediaContainerWidth,
               height: $scope.mediaContainerHeight,
               cursor: 'default',
               'vertical-align': 'top'
            };
         }                
      
         $scope.onPictureSelectSuccess = function(files) {
            $scope.isLoadingPicture = true;
            
            PictureService.getPictureFromFileModel(files[0])
            .then(function(picture) {
               PictureProportionalResizeService.resizePicture(picture, maxPictureWidth)
               .then(function(newPicture) {
                  $scope.setModel(newPicture);
               })
               .catch(function(error) {
                  $scope.error(error);
               });           
            })
            .catch(function(error) {
               $scope.error(error);
            })
            .finally(function() {
               $scope.isLoadingPicture = false;
            });
         }
         
         $scope.onPictureSelectError = function(error) {
            $scope.error(error);
         }
         
         $scope.onPictureSelectProgress = function(progress) {
            
         }  
      }
   }
}])

module.exports = name;