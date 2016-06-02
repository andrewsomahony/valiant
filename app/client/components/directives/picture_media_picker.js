'use strict';

var registerDirective = require('directives/register');

var name = 'pictureMediaPicker';

registerDirective(name, [require('services/picture_proportional_resize_service'),
                         require('services/picture_service'),
function(PictureProportionalResizeService, PictureService) {
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
               //display: 'inline-block',
               width: $scope.mediaContainerWidth,
               height: $scope.mediaContainerHeight,
               cursor: 'default',
               'vertical-align': 'top'
            };
         }
         
         $scope.deletePicture = function() {
            $scope.model.reset();
         }
         
         // TODO: We need to activate the input
         // differently on Android: we need to activate it
         // directly from this event, as it occurs as per an action
         // by the user, as opposed to setting the .active variable,
         // which is an event caused programatically.
         
         // PS: Android Browser is the worst browser ever written.
         
         //$scope.picturePickerIsActive.active = true;
               
         $scope.activatePicturePicker = function() {
            if (false === $scope.isReadOnly) {
               //$element.find('input')[0].click();
               $scope.picturePickerIsActive.active = true;
            }
         }
      
         $scope.onPictureSelectSuccess = function(files) {
            PictureService.getPictureFromFileModel(files[0])
            .then(function(picture) {
               PictureProportionalResizeService.resizePicture(picture, maxPictureWidth)
               .then(function(newPicture) {
                  $scope.model = newPicture;
               })
               .catch(function(error) {
                  
               });             
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