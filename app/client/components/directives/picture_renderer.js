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
        // showUploading: "@"
      },
      link: function($scope, $element, $attributes) {
         $scope.fitted = ScopeService.parseBool($attributes.fitted, false);
         $scope.centered = ScopeService.parseBool($attributes.centered, false);
         $scope.showUploading = ScopeService.parseBool($attributes.showUploading, true);
         
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
               } else if ($scope.height) {
                  style['width'] = 'auto';
                  style['height'] = $scope.height;
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
            } 
            
            return style;           
         }
                  
         $element.attr('ng-style', 'getElementStyle()');
         $element.attr('ng-class', 'getElementClass()');
         
         var $imageElement = angular.element('<img />');
         $imageElement.attr('ng-src', "{{model.url}}");
         $imageElement.attr('ng-class', 'getImageClass()');
         $imageElement.attr('ng-style', 'getImageStyle()');
         
         $element.append($compile($imageElement)($scope));
         
         if (true === $scope.showLoading) {
            var $loadingElement = angular.element("<div></div>");
            
            $loadingElement.attr('loading-progress', '');
            $loadingElement.attr('ng-if', 'model.upload_progress');
            $loadingElement.attr('type', 'overlay_circle');
            $loadingElement.attr('show-percentage', 'false');
            $loadingElement.attr('progress-object', 'model.upload_progress');
            
            $element.append($compile($loadingElement)($scope)); 
         }
         
         $element.removeAttr('picture-renderer');
         $compile($element)($scope);
      } 
   }
}
]);

module.exports = name;