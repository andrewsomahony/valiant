'use strict';

var registerDirective = require('directives/register');

var name = 'mediaRenderer';

registerDirective(name, ['$compile',
function($compile) {
   return {
      restrict: 'A',
      compile: function($element, $attributes) {
         if ($attributes) {         
            var mediaType = $attributes[name];
            
            if (!mediaType) {
               throw new Error("Missing media type for media-renderer directive!");
            }
            
            $element.removeAttr('media-renderer');
            $element.addClass('media-renderer');
            
            if ('picture' === mediaType) {
               $element.attr('picture-renderer', '');
            } else if ('video' === mediaType) {
               $element.attr('video-renderer', '');
            } else if ('youtube' === mediaType) {
               $element.attr('youtube-renderer', '');
            } else {
               throw new Error("Unknown media type for media-renderer directive: ", mediaType);
            }
         }
         
         return {
            pre: function($scope, $element, $attributes) {
               
            },
            post: function($scope, $element, $attributes) {
               $compile($element)($scope);
            }
         };
      }
   }
}   
]);

module.exports = name;