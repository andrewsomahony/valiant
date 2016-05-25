'use strict';

var registerDirective = require('directives/register');

var name = 'pictureMediaPicker';

registerDirective(name, [require('services/picture_proportional_resize_service'),
function(PictureProportionalResizeService) {
   return {
      // We just want to use our parent's scope,
      // so we inherit the model variable
      // that we can manipulate
      
      restrict: "E",
      templateUrl: "directives/picture_media_picker.html",
      link: function($scope, $element, $attribues) {
          
         var maxPictureWidth = 800; 
          
         $scope.picturePickerIsActive = {active: false};
      
         $scope.getHasMediaDivStyle = function() {
            return {
               display: 'inline-block',
               width: $scope.mediaContainerWidth,
               height: $scope.mediaContainerHeight,
               cursor: 'default',
               border: '1px solid black',
               'vertical-align': 'top'
            };
         }
         
         $scope.getHasMediaImageContainerStyle = function() {
            // !!! UNUSED
            // !!! Trying to figure out how to have a div
            // container that has the exact dimensions of
            // the underlying image.
            
            var style = {};
            
            if ($scope.model.getWidth() > $scope.model.getHeight()) {
               style['height'] = 'auto';
               style['width'] = '75%';
            } else {
               style['width'] = 'auto';
               style['height'] = '98%';
            }  
            
            return style;            
         }
         
         $scope.getHasMediaImageStyle = function() {
            var style = {};
            
            if ($scope.model.getWidth() > $scope.model.getHeight()) {
               style['height'] = 'auto';
               style['width'] = '75%';
            } else {
               style['width'] = 'auto';
               style['height'] = '98%';
            }  
            
            return style;  
         }
         
         $scope.deletePicture = function() {
            $scope.model.setFileModel(null);
         }
      
         $scope.activatePicturePicker = function() {
            $scope.picturePickerIsActive.active = true;
         }
      
         $scope.onPictureSelectSuccess = function(files) {
            PictureProportionalResizeService.resizePictureFromFileModel(files[0], maxPictureWidth)
            .then(function(data) {
               $scope.model.setFileModel(data.fileModel);
            })
            .catch(function(error) {
               
            })
         }
         
         $scope.onPictureSelectError = function(error) {
            
         }
         
         $scope.onPictureSelectProgress = function(progress) {
            
         }
      }
   }
}])

module.exports = name;