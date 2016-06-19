'use strict';

var registerDirective = require('directives/register');

var name = 'pictureMediaPicker';

registerDirective(name, [require('services/picture_proportional_resize_service'),
                         require('services/picture_service'),
                         require('services/promise'),
                         require('services/serial_promise'),
                         '$timeout',
function(PictureProportionalResizeService, PictureService, 
Promise, SerialPromise, $timeout) {
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
            $scope.error(null);
            $scope.setIsLoadingMedia(true);

            var promiseFnArray = [];

            promiseFnArray.push(function(existingData, index, forNotify) {
               if (false === forNotify) {
                  return Promise(function(resolve, reject, notify) {
                     PictureService.getPictureFromFileModel(files[0])
                     .then(function(picture) {
                        resolve({picture: picture});
                     })
                     .catch(function(error) {
                        reject(error);
                     });
                  });
               }
            });

            promiseFnArray.push(function(existingData, index, forNotify) {
               if (false === forNotify) {
                  return Promise(function(resolve, reject, notify) {
                     PictureProportionalResizeService.resizePicture(existingData.picture, maxPictureWidth)
                     .then(function(resizedPicture) {
                        // We want to compile because we can have a fade-in and out
                        // effect when the media shows up.  Without compiling, all that
                        // changes is the video URL, and therefore, the video element.  When
                        // we compile, the entire DIV changes, and we get a neat transition.

                        $timeout(function() {
                           $scope.setModel(resizedPicture)
                        })
                        .then(function() {
                           resolve();
                        })
                     })
                     .catch(function(error) {
                        reject(error);
                     })
                  })
               }
            });

            SerialPromise(promiseFnArray)
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