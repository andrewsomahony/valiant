'use strict';

var registerDirective = require('directives/register');

var utils = require('utils');

var name = 'youtubeMediaPicker';

registerDirective(name, [require('services/youtube_url_modal_service'),
                         require('models/video'),
                         '$timeout',
function(YoutubeUrlModalService, VideoModel, $timeout) {
   return {
      // We just want to use our parent's scope,
      // so we inherit the model variable
      // that we can manipulate
      
      restrict: "E",
      scope: false,
      templateUrl: "directives/youtube_media_picker.html",
      link: function($scope, $element, $attribues) {
         $scope.getHasMediaDivStyle = function() {
            return {
               //display: 'inline-block',
               width: $scope.mediaContainerWidth,
               height: $scope.mediaContainerHeight,
               cursor: 'default',
               'vertical-align': 'top'
            };
         }
         
         $scope.onYoutubeRendererError = function(error) {
            $scope.deleteModel();
            $scope.error(error);
         }
         
         $scope.getYoutubeRendererWidth = function() {
            return utils.round(parseInt($scope.mediaContainerWidth) * 1) + "px"
         }
         
         $scope.activateUrlModal = function() {
            YoutubeUrlModalService()
            .then(function(url) {
               $scope.deleteModel();
               
               // We need the DOM to recompile,
               // as our renderer directive seems to have
               // some sort of problem recompiling on its own.
               
               // We use the timeout to make sure the compiling happens.
               
               $timeout(function() {
                  var newModel = new VideoModel({url: url});
                  $scope.setModel(newModel);                  
               }).then(null);

            })
            .catch(function(error) {
               $scope.error(error);
            })
         }

      }
   }
}])

module.exports = name;