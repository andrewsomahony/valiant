'use strict';

var registerDirective = require('directives/register');

var name = 'youtubeMediaPicker';

registerDirective(name, [
function() {
   return {
      // We just want to use our parent's scope,
      // so we inherit the model variable
      // that we can manipulate
      
      restrict: "E",
      templateUrl: "directives/youtube_media_picker.html",
      link: function($scope, $element, $attribues) {
      }
   }
}])

module.exports = name;