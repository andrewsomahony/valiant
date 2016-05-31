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
               'vertical-align': 'top'
            };
         }
         
         $scope.deletePicture = function() {
            $scope.model.setFileModel(null);
         }
      
         $scope.activatePicturePicker = function() {
            if (false === $scope.isReadOnly) {
               $scope.picturePickerIsActive.active = true;
            }
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