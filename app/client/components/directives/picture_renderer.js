'use strict';

var registerDirective = require('directives/register');

var name = 'pictureRenderer';

registerDirective(name, [require('services/scope_service'),
                         '$compile',
function(ScopeService, $compile) {
   return {
      restrict: 'A',
      scope: {
         model: "<",
         //fitted: "@",
         //centered: "@",
         width: "@",
         height: "@",

         maxWidth: "@",
         maxHeight: "@",
        // showUploading: "@"
      },
      link: function($scope, $element, $attributes) {
         // "fitted" basically means we want to
         // fit the image so it fits within the element
         // that we are attaching the directive to.
         // We can also center it within that element.
         
         // Not fitted just means that the div is sized
         // to fit the image, and can be moved around wherever.

         ScopeService.watchBool($scope, $attributes, 'fitted', false);
         ScopeService.watchBool($scope, $attributes, 'centered', false);
         ScopeService.watchBool($scope, $attributes, 'showUploading', true);
         
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

                  if ($scope.maxHeight) {
                    style['max-height'] = $scope.maxHeight;
                  }
               } else if ($scope.height) {
                  style['width'] = 'auto';
                  style['height'] = $scope.height;

                  if ($scope.maxWidth) {
                    style['max-width'] = $scope.maxWidth;
                  }
               } else {
                  style['width'] = 'auto';
                  style['height'] = 'auto';
               }
            }
            
            return style;
         }
         
         $scope.getElementClass = function() {
            var classes = [];
            
            classes.push('picture-renderer');
            
            if (true === $scope.fitted) {
               classes.push('fitted');
            }
            
            return classes;
         }
         
         $scope.getImageClass = function() {
            var classes = [];
            
            if (true === $scope.fitted) {
               if (true === $scope.centered) {
                  classes.push('centered');
               } 
            }
            
            return classes;
         }
         
         $scope.getImageStyle = function() {
            var style = {};
            
            if (true === $scope.fitted) {
               if ($scope.model.getWidth() > $scope.model.getHeight()) {
                  style['height'] = 'auto';
                  style['width'] = $scope.width || '88%';
               } else {
                  style['width'] = 'auto';
                  style['height'] = $scope.height || '98%';
               }
               
               style['max-width'] = '100%';
               style['max-height'] = '100%';
            } else {
               if ($scope.maxWidth) {
                  style['max-width'] = $scope.maxWidth;
               }
               if ($scope.maxHeight) {
                  style['max-height'] = $scope.maxHeight;
               }
            }

            return style;           
         }
                  
         $element.attr('ng-style', 'getElementStyle()');
         $element.attr('ng-class', 'getElementClass()');
         
         var $imageElement = angular.element('<img />');
         $imageElement.attr('ng-src', "{{model.url}}");
         $imageElement.attr('ng-class', 'getImageClass()');
         $imageElement.attr('ng-style', 'getImageStyle()');
         
         $element.append($imageElement);
         
         if (true === $scope.showUploading) {
            var $loadingElement = angular.element("<div></div>");
            
            $loadingElement.attr('loading-progress', '');
            $loadingElement.addClass('fade-in');
            $loadingElement.attr('ng-if', 'model.upload_progress');
            $loadingElement.attr('type', 'overlay_circle');
            $loadingElement.attr('show-percentage', 'false');
            $loadingElement.attr('progress-object', 'model.upload_progress');
            
            $element.append($loadingElement); 
         }
         
         $element.removeAttr('picture-renderer');
         $compile($element)($scope);
      } 
   }
}
]);

module.exports = name;