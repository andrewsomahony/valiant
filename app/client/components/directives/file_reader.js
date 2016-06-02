'use strict';

var registerDirective = require('directives/register');

var utils = require('utils');

var name = 'fileReader';

registerDirective(name, [require('models/file'),
                         require('services/promise'),
                         require('services/serial_promise'),
                         require('services/parallel_promise'),
                         require('services/progress'),
                         require('services/file_reader_service'),
                         require('services/image_service'),
                         require('services/file_type_validator_service'),
                         require('services/mime_service'),
                         require('services/error'),
                         require('services/scope_service'),
function(FileModel, Promise, SerialPromise, ParallelPromise, ProgressService,
FileReaderService, ImageService, FileTypeValidatorService, MimeService, ErrorService,
ScopeService) {
   return {
      restrict: 'E',
      template: "",
      scope: {
         maxFiles: "@",
         maxFileSizeKb: "@",
         //supportsMultiple: "@",
         accept: "@",
         onFilesAdded: "&",
         onFilesError: "&",
         onFilesProgress: "&",
         isActive: "=",
      },
      link: function($scope, $element, $attributes) {
         $scope.supportsMultiple = ScopeService.parseBool($attributes.supportsMultiple, false);
         
         $scope.onFilesProgress = $scope.onFilesProgress || function() {}
         $scope.onFilesError = $scope.onFilesError || function() {}

         function onInputChange() {
            var fileArray = []
            for (var i = 0; i < this.files.length; i++) {
               fileArray.push(this.files.item(i))
            }
                        
            var promiseFnArray = fileArray.map(function(file) {
               return function(isNotify) {
                  return Promise(function(resolve, reject) {
                     // We validate because I'm not sure which browsers
                     // support the "accept" tag on the file reader,
                     // and because the browser only uses the extension of the file
                     // to see if it's ok to load.

                     var fileModel = FileModel.fromFileObject(file);
                     
                     FileTypeValidatorService.validateFileModel(fileModel, $scope.accept)
                     .then(function() {
                        resolve(fileModel);
                     }) 
                     .catch(function() {
                        reject(ErrorService.localError("File type not accepted! " + file.name))
                     })
                  });
               }
            });
            
            ParallelPromise.withNotify(promiseFnArray, true)
            .then(function(files) {
               $scope.onFilesAdded({files: files});
            }, null, function(notifyData) {
               $scope.onFilesProgress({progress: notifyData});
            })
            .catch(function(error) {
               $scope.onFilesError({error: error});
            })              
         }

         $scope.$watch('isActive', function(newValue, oldValue) {
            if (newValue) {
               if (true === newValue.active) {
                  $element.find('input').remove()
                  $element.append(angular.element("<input class=\"file-reader-picker\" type=\"file\" name=\"files[]\" ng-disabled=\"disabled\">"))
                  
                  var $inputElement = $element.find('input');
                  
                  $inputElement.on('change', onInputChange)

                  if (true === $scope.supportsMultiple) {
                     $inputElement.attr('multiple', '');
                  }
                  $inputElement.attr('accept', $scope.accept);
                 // $inputElement.attr('capture', 'camera');
                  
                  var event = new MouseEvent('click', {
                     'view': window,
                     'bubbles': true,
                     'cancelable': true
                  });
                  
                  $inputElement[0].dispatchEvent(event);
                  $scope.isActive.active = false;
               }
            }
         }, true)
      }
   }
}])

module.exports = name;