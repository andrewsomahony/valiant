'use strict';

var registerDirective = require('directives/register');

var name = 'videoMediaPicker';

registerDirective(name, [require('services/video_service'),
                         require('services/file_reader_activator_service'),
function(VideoService, FileReaderActivatorService) {
   return {
      // We just want to use our parent's scope,
      // so we inherit the model variable
      // that we can manipulate
      
      restrict: "E",
      templateUrl: "directives/video_media_picker.html",
      link: function($scope, $element, $attribues) {
         $scope.videoPicker = FileReaderActivatorService.makeCreationObject();//{active: false};
      
         $scope.getHasMediaDivStyle = function() {
            return {
               width: $scope.mediaContainerWidth,
               height: $scope.mediaContainerHeight,
               cursor: 'default',
               'vertical-align': 'top'
            };
         }
         
         $scope.deleteVideo = function() {
            $scope.model.reset();
         }
         
         FileReaderActivatorService.createFileReader($scope.videoPicker);
      
         $scope.activateVideoPicker = function() {
            if (false === $scope.isReadOnly) {
               FileReaderActivatorService.activateFileReader($scope.videoPicker);
               //$scope.videoPickerIsActive.active = true;
            }
         }
         
         $scope.onVideoSelectCreated = function(elementId) {
            FileReaderActivatorService.fileReaderCreated($scope.videoPicker, elementId);
         }
      
         $scope.onVideoSelectSuccess = function(files) {
            VideoService.getVideoFromFileModel(files[0])
            .then(function(video) {
               // Convert here?
               $scope.model = video;
            })
            .catch(function(error) {
               
            });
         }
         
         $scope.onVideoSelectError = function(error) {
            
         }
         
         $scope.onVideoSelectProgress = function(progress) {
            
         }      
      }
   }
}])

module.exports = name;