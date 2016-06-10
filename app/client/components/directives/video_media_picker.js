'use strict';

var registerDirective = require('directives/register');

var utils = require('utils');

var name = 'videoMediaPicker';

registerDirective(name, [require('services/video_service'),
                         require('services/serial_promise'),
                         require('services/progress'),
                         require('services/promise'),
function(VideoService, SerialPromise, ProgressService, Promise) {
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
         
         $scope.conversionProgress = null;
         
         $scope.getProgressMessage = function() {
            if ($scope.conversionProgress) {
               return "Converting..." + (utils.round($scope.conversionProgress.percentage() * 100, 0)) + "%";
            } else {
               return "";
            }
         }
         
         $scope.onVideoEvent = function(name) {
            console.log("Video event! ", name, $scope.videoInformation);
         }
      
         $scope.onVideoSelectSuccess = function(files) {
            $scope.setIsLoadingMedia(true);
            $scope.conversionProgress = null;
            
            var promiseFnArray = [];
            
            promiseFnArray.push(function(existingData, index, forNotify) {
               return Promise(function(resolve, reject, notify) {
                  VideoService.getVideoFromFileModel(files[0])
                  .then(function(video) {
                     resolve({video: video});
                  })
                  .catch(function(error) {
                     reject(error);
                  })
               });
            });
            
            promiseFnArray.push(function(existingData, index, forNotify) {
               return Promise(function(resolve, reject, notify) {
                  VideoService.getVideoThumbnail(existingData.video)
                  .then(function(newVideo) {
                     resolve({video: newVideo,
                              thumbnail: newVideo.thumbnail});
                  })
                  .catch(function(error) {
                     reject(error);
                  })
               });
            });
            
            promiseFnArray.push(function(existingData, index, forNotify) {
               return Promise(function(resolve, reject, notify) {
                  VideoService.convertVideoToHTML5(existingData.video)
                  .then(function(convertedVideo) {
                     convertedVideo.setThumbnail(existingData.thumbnail);
                     resolve({video: convertedVideo});
                  }, null, function(progress) {
                     $scope.conversionProgress = progress;
                  })
                  .catch(function(error) {
                     reject(error);
                  })
               });
            });
            
            SerialPromise(promiseFnArray, null, ['video'], true)
            .then(function(video) {
               $scope.setModel(video);
            })
            .catch(function(error) {
               $scope.error(error);
            })
            .finally(function() {
               $scope.setIsLoadingMedia(false);
               $scope.conversionProgress = null;
            });
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