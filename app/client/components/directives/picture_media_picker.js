'use strict';

var registerDirective = require('directives/register');

var name = 'pictureMediaPicker';

registerDirective(name, [require('services/picture_proportional_resize_service'),
                         require('services/picture_service'),
                         '$timeout',
function(PictureProportionalResizeService, PictureService, $timeout) {
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
            $scope.deleteModel();
            $scope.setIsLoadingMedia(true);
            
            PictureService.getPictureFromFileModel(files[0])
            .then(function(picture) {
               PictureProportionalResizeService.resizePicture(picture, maxPictureWidth)
               .then(function(newPicture) {
                  // We need the DOM to recompile,
                  // as our renderer directive seems to have
                  // some sort of problem recompiling on its own.
                  
                  // We use the timeout to make sure the compiling happens.
                  $timeout(function() {
                     $scope.setModel(newPicture);
                  }).then(null);
               })
               .catch(function(error) {
                  $scope.error(error);
               });           
            })
            .catch(function(error) {
               $scope.error(error);
            })
            .finally(function() {
               $scope.setIsLoadingMedia(false);
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