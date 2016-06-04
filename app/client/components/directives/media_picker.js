'use strict';

var registerDirective = require('directives/register');

var name = 'mediaPicker';

registerDirective(name, [require('services/scope_service'),
                         require('services/file_reader_activator_service'),
function(ScopeService, FileReaderActivatorService) {
   return {
      restrict: 'E',
      scope: {
         type: "@",
         model: "=",
         width: "@",
         height: "@",
         size: "@",
         mediaContainerWidth: "@",
         mediaContainerHeight: "@",
        // isReadOnly: "@"
      },
      templateUrl: "directives/media_picker.html",
      link: function($scope, $element, $attributes) {
         $scope.width = $scope.width || "200px";
         $scope.height = $scope.height || "200px";
         
         $scope.mediaContainerWidth = $scope.mediaContainerWidth || "300px";
         $scope.mediaContainerHeight = $scope.mediaContainerHeight || "300px";
         
         $scope.isReadOnly = ScopeService.parseBool($attributes.isReadOnly, false);
         
         $scope.isLoadingMedia = false;
         $scope.errorMessage = "";     
         
         $scope.fileReaderCreator = FileReaderActivatorService.makeCreationObject(); 
         
         $scope.isPicture = function() {
            return 'picture' === $scope.type;
         }
         $scope.isVideo = function() {
            return 'video' === $scope.type;
         }
         $scope.isYoutube = function() {
            return 'youtube' === $scope.type;
         }

         $scope.deleteModel = function() {
            $scope.model.reset();
         }
         
         $scope.setModel = function(m) {
            $scope.model.fromModel(m);
         }      
         
         $scope.setIsLoadingMedia = function(lm) {
           $scope.isLoadingMedia = lm;
         }
         
         $scope.error = function(errorObject) {
            if (!errorObject) {
               $scope.errorMessage = "";
            } else {
               $scope.errorMessage = errorObject.toString(false);
            }
         }         
         
         $scope.getRootNoMediaDivStyle = function() {
            var style = {
               //display: 'inline-block',
               width: $scope.width,
               height: $scope.height,
               border: "1px solid black"
            };
                        
            if (true === $scope.isReadOnly) {
               style['cursor'] = 'default';
            } else {
               style['cursor'] = 'pointer';
            }
            
            return style;
         }

         $scope.hasMedia = function() {
            return $scope.model.url ? true : false;
         }          
         
         $scope.getErrorStyle = function() {
            var style = {};
            
            if ($scope.hasMedia()) {
               style['max-width'] = $scope.mediaContainerWidth;
            } else {
               style['max-width'] = $scope.width;
            }
            
            return style;
         } 
         
         $scope.activateFileReader = function() {
            if (false === $scope.isReadOnly) {
               FileReaderActivatorService.activateFileReader($scope.fileReaderCreator);
            }
         }
         
         FileReaderActivatorService.createFileReader($scope.fileReaderCreator);  
         
         $scope.onFileReaderCreated = function(elementId) {
            FileReaderActivatorService.fileReaderCreated($scope.fileReaderCreator, elementId);
         }      
      }     
   }
}]);

module.exports = name;