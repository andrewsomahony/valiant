'use strict';

var registerDirective = require('directives/register');

var name = 'youtubeRenderer';

var utils = require('utils');


//^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$

registerDirective(name, ['$compile', 
                         '$timeout',
                         require('services/error'),
                         require('services/scope_service'),
function($compile, $timeout, ErrorService, ScopeService) {
   return {
      restrict: 'A',
      scope: {
         model: "<",
         onError: "&",
         onEvent: "&",
         //fitted: "@",
         //centered: "@",
         // THESE CAN ONLY BE IN PIXELS
         // DUE TO HAVING TO DO THE ASPECT RATIO MYSELF        
         width: "@",
         height: "@",
         showLoading: "@"
      },
      link: function($scope, $element, $attributes) {
         $scope.fitted = ScopeService.parseBool($attributes.fitted, false);
         $scope.centered = ScopeService.parseBool($attributes.centered, false);
         $scope.showLoading = ScopeService.parseBool($attributes.showLoading, true);         
      
         var widthToHeightRatio = 1.809;
      
         $scope.getElementStyle = function() {
            var style = {};
            
            if (false === $scope.fitted) {
               if ($scope.width) {
                  style['width'] = $scope.width;
                  style['height'] = "" + utils.round(parseInt($scope.width) / widthToHeightRatio) + "px";
               } else if ($scope.height) {
                  style['width'] = "" + utils.round(parseInt($scope.height) * widthToHeightRatio) + "px";
                  style['height'] = $scope.height;
               }
            }
            
            return style;
         }
         
         $scope.getElementClass = function() {
            var classes = [];
            
            classes.push('youtube-renderer');
            if (true === $scope.fitted) {
               classes.push('fitted');
            }
            return classes;
         }
         
         $scope.getYoutubeClass = function() {
            var classes = [];
            
            if (true === $scope.fitted) {
               if (true === $scope.centered) {
                  classes.push("centered");
               }
            }
            return classes;
         }
         
         $scope.getYoutubeStyle = function() {
            var style = {};
            
            if (true === $scope.fitted) {
               if ($scope.width) {
                  style['width'] = $scope.width;
                  style['height'] = "" + utils.round(parseInt($scope.width) / widthToHeightRatio) + "px";
               } else if ($scope.height) {
                  style['width'] = "" + utils.round(parseInt($scope.height) * widthToHeightRatio) + "px";
                  style['height'] = $scope.height;
               }
            }
            
            return style;
         }
         
         function getYoutubeIdFromUrl(url) {
            var urlMatch = url.match(
               /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i);
            
            console.log(urlMatch);
            if (urlMatch) {
               return urlMatch[5];
            } else {
               return null;
            }
         }
         
         $scope.getEmbeddedYoutubeUrl = function() {
            var url = "http://www.youtube.com/embed/";
            
            url += $scope.youtubeId;
            
            url += "?";
            url += "fs=1";
            url += "&playinline=0";
            url += "&modestbranding=1";
            
            return url;
            //http://www.youtube.com/embed/PekRc5Ufp10?fs=1&playinline=0&modestbranding=1
         }
                           
         // We want to make sure the URL
         // is ok for embedding into an iframe,
         // so we wait until the next cycle,
         // when everything is bound, to create and recompile the element.
         $timeout(function() {
            var id = getYoutubeIdFromUrl($scope.model.url);
            
            if (!id) {
               console.log($scope.onError);
               $scope.onError({error: ErrorService.localError("Invalid youtube url!")});
            } else {
               $scope.youtubeId = id;
               
               $element.attr('ng-style', 'getElementStyle()');
               $element.attr('ng-class', 'getElementClass()');
            
               var $iFrameElement = angular.element("<iframe></iframe>");
               $iFrameElement.attr('ng-src', "{{getEmbeddedYoutubeUrl() | trusted}}");
               $iFrameElement.attr('ng-style', 'getYoutubeStyle()');
               $iFrameElement.attr('ng-class', 'getYoutubeClass()');
               
               $element.append($compile($iFrameElement)($scope));
               
               $element.removeAttr('youtube-renderer');
               $compile($element)($scope);
            }
         }, 1).then(null);
      }
   }
}]);

module.exports = name;