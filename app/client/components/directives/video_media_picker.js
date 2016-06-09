'use strict';

var registerDirective = require('directives/register');

var name = 'videoMediaPicker';

registerDirective(name, [require('services/video_service'),
function(VideoService) {
   return {
      // We just want to use our parent's scope,
      // so we inherit the model variable
      // that we can manipulate
      
      restrict: "E",
      templateUrl: "directives/video_media_picker.html",
      link: function($scope, $element, $attribues) {      
         $scope.getHasMediaDivStyle = function() {
            return {
               width: $scope.mediaContainerWidth,
               height: $scope.mediaContainerHeight,
               cursor: 'default',
               'vertical-align': 'top'
            };
         }
         
         $scope.videoInformation = {};
         
         $scope.onVideoEvent = function(name) {
            console.log("Video event! ", name, $scope.videoInformation);
         }
      
         $scope.onVideoSelectSuccess = function(files) {
            $scope.setIsLoadingMedia(true);
            
            VideoService.getVideoFromFileModel(files[0])
            .then(function(video) {
               // Convert here?
               VideoService.getVideoThumbnail(video)
               .then(function(newVideo) {
                  
                  var thumbnail = newVideo.thumbnail;
                  VideoService.convertVideoToHTML5(newVideo)
                  .then(function(convertedVideo) {
                     convertedVideo.setThumbnail(thumbnail);
                     $scope.setModel(convertedVideo);
                  }, null, function(progress) {
                     console.log("CONVERSION PROGRESS", progress);
                  })
                  .catch(function(error) {
                     $scope.error(error);
                  })
                  .finally(function() {
                     $scope.setIsLoadingMedia(false);
                  })
                  
               })
               .catch(function(error) {
                  $scope.error(error);
               })
            })
            .catch(function(error) {
               $scope.error(error);
            })
         }
         
         $scope.onVideoSelectError = function(error) {
            $scope.error(error);
         }
         
         $scope.onVideoSelectProgress = function(progress) {
            
         }      
      }
   }
}])

module.exports = name;