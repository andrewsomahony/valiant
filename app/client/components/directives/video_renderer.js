'use strict';

var registerDirective = require('directives/register');

var name = 'videoRenderer';

// So much code-reuse, but I can't seem to figure
// out how to inherit a scope properly

registerDirective(name, [require('services/scope_service'),
                         require('services/progress'),
                         '$compile',
function(ScopeService, ProgressService, $compile) {
   return {
     restrict: 'A',
      scope: {
         model: "<",
         information: "=",
         onEvent: "&",
         //fitted: "@",
         //centered: "@",
         width: "@",
         height: "@",
         //canPreload: "@",
         //canHideWhileLoading: "@"
        // showLoading: "@",
      }, 
      link: function($scope, $element, $attributes) {
         $scope.fitted = ScopeService.parseBool($attributes.fitted, false);
         $scope.centered = ScopeService.parseBool($attributes.centered, false);
         $scope.showLoading = ScopeService.parseBool($attributes.showLoading, true);
         $scope.canPreload = ScopeService.parseBool($attributes.canPreload, false);
         $scope.canHideWhileLoading = ScopeService.parseBool($attributes.canHideWhileLoading, false);
         
         $scope.isPreloading = false;
         
         $scope.getElementStyle = function() {
            var style = {};
            
            if (false === $scope.fitted) {
               // The div restricts the auto-resizing
               // image to a proportion, and sizes
               // with that image.
                              
               // With images we can scale width or
               // height as auto, but with video, only
               // width seems to work.                
                              
               if ($scope.width) {
                  style['width'] = $scope.width;
                  style['height'] = 'auto';
               } else {
                  style['width'] = 'auto';
                  style['height'] = 'auto';
               }
            }
            
            return style;
         }
         
         $scope.getElementClass = function() {
            var classes = [];
            
            classes.push('video-renderer');
            
            if (true === $scope.fitted) {
               classes.push('fitted');
            }
            
            return classes;
         }
         
         $scope.getVideoClass = function() {
            var classes = [];
            
            if (true === $scope.isPreloading &&
                true === $scope.canHideWhileLoading) {
               classes.push('offscreen');     
            } else {
               if (true === $scope.fitted) {
                  if (true === $scope.centered) {
                     classes.push('centered');
                  } 
               }
            }
            
            return classes;
         }
         
         $scope.getVideoStyle = function() {
            var style = {};
            
            if (true === $scope.fitted) {
               style['height'] = 'auto';
               style['width'] = $scope.width || '88%';
               style['max-height'] = '100%';
            } 
            
            return style;           
         }
         
         function setVideoInformation(key, object) {
            if ($scope.information) {
               $scope.information[key] = object;
            }
         }
         
         function sendVideoEvent(name) {
            if ($scope.onEvent) {
               $scope.onEvent({name: name});
            }
         }
         
         function getVideoEventTarget(event) {
            return event.target;
         }
         
         function bindVideoEvents($element) {
            var videoElement = $element[0];
            
            videoElement.addEventListener('loadstart', function(event) {
                console.log("VIDEO LOAD START", event);

                $scope.$apply(function() {
                   $scope.isPreloading = true;
                   sendVideoEvent('loadstart');
                })
            });
            
            videoElement.addEventListener('loadedmetadata', function(event) {
                console.log("VIDEO METADATA LOADED", event);
                
                $scope.$apply(function() {
                   var target = getVideoEventTarget(event);
                   setVideoInformation('width', target.videoWidth);
                   setVideoInformation('height', target.videoHeight);
                   setVideoInformation('duration', target.duration);
                   
                   if (false === $scope.canPreload) {
                      $scope.isPreloading = false;
                   }
                   
                   sendVideoEvent('loadedmetadata');
                });
            });
            
            videoElement.addEventListener('progress', function(event) {
                console.log("VIDEO LOAD PROGRESS", event);
                $scope.$apply(function() {
                   var target = getVideoEventTarget(event);
                  
                   var buffered = target.buffered;
                  
                   if (buffered.length) {
                      setVideoInformation('load_progress', ProgressService(buffered.start(0), buffered.end(0)));
                   }
                   sendVideoEvent('progress');
                });
            });
            
            videoElement.addEventListener('timeupdate', function(event) {
                console.log("TIME UPDATE", event);
                
                $scope.$apply(function() {
                   var target = getVideoEventTarget(event);
                   setVideoInformation('current_time', target.currentTime);
                   sendVideoEvent('timeupdate');
                });
            });
            
            videoElement.addEventListener('seeking', function(event) {
                console.log("SEEKING", event);

                $scope.$apply(function() {
                   var target = getVideoEventTarget(event);
                   setVideoInformation('current_time', target.currentTime);
                   sendVideoEvent('seeking');
                });
            });
            
            videoElement.addEventListener('seeked', function(event) {
                console.log("SEEKED", event);

                $scope.$apply(function() {
                   var target = getVideoEventTarget(event);
                   setVideoInformation('current_time', target.currentTime);
                   sendVideoEvent('seeked');
                });
            });
            
            videoElement.addEventListener('pause', function(event) {
               console.log("VIDEO PAUSED", event);

               $scope.$apply(function() {
                  var target = getVideoEventTarget(event);
                  setVideoInformation('current_time', target.currentTime);
                  sendVideoEvent('pause');
               });
            });
            
            videoElement.addEventListener('canplay', function(event) {
               console.log("VIDEO CAN PLAY", event);
               
               $scope.$apply(function() {
                  sendVideoEvent('canplay');
               });
            });
            
            videoElement.addEventListener('canplaythrough', function(event) {
               console.log("VIDEO CAN PLAY THROUGH", event);
               
               $scope.$apply(function() {
                  $scope.isPreloading = false;
                  sendVideoEvent('canplaythrough');
               })
            })
            
         }
                  
         $element.attr('ng-style', 'getElementStyle()');
         $element.attr('ng-class', 'getElementClass()');
         
         var $videoElement = angular.element('<video></video>');
         $videoElement.attr('src', "{{model.url | trusted}}");
         $videoElement.attr('ng-class', 'getVideoClass()');
         $videoElement.attr('ng-style', 'getVideoStyle()');
         $videoElement.attr('controls', '');
         
         if (true === $scope.canPreload) {
            $videoElement.attr('preload', 'auto');            
         } else {
            $videoElement.attr('preload', 'metadata');
         }
    
         if (true === $scope.canHideWhileLoading) {
            var $loadingMediaDiv = angular.element("<div></div>");
            
            $loadingMediaDiv.attr('font-awesome-centered-icon', '');
            $loadingMediaDiv.attr('font-awesome-params', 'fa fa-refresh fa-spin fa-4x fa-fw');
            $loadingMediaDiv.attr('ng-if', 'isPreloading');
            
            $element.append($compile($loadingMediaDiv)($scope));
         }    
         
         bindVideoEvents($videoElement);
         
         $element.append($compile($videoElement)($scope));
         
         if (true === $scope.showLoading) {
            var $loadingElement = angular.element("<div></div>");
            
            $loadingElement.attr('loading-progress', '');
            $loadingElement.attr('ng-if', 'model.upload_progress');
            $loadingElement.attr('type', 'overlay_circle');
            $loadingElement.attr('show-percentage', 'false');
            $loadingElement.attr('progress-object', 'model.upload_progress');
            
            $element.append($compile($loadingElement)($scope)); 
         }
         
         $element.removeAttr('video-renderer');
         $compile($element)($scope);
      }
   };
}]);

module.exports = name;