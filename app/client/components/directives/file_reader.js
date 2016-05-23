'use strict';

var registerDirective = require('directives/register');

var name = 'fileReader';

registerDirective(name, [require('models/file'),
                         require('services/promise'),
                         require('services/serial_promise'),
                         require('services/parallel_promise'),
                         require('services/progress'),
                         require('services/file_reader_service'),
                         require('services/image_service'),
function(FileModel, Promise, SerialPromise, ParallelPromise, ProgressService,
FileReaderService, ImageService) {
   return {
      restrict: 'E',
      template: "",
      scope: {
         //maxFiles: "@",
         //maxFileSizeKb: "@",
         //supportsMultiple: "@",
         //accept: "@",
         onFilesAdded: "&",
         onFilesError: "&",
         onFilesProgress: "&",
         isActive: "=",
      },
      link: function($scope, $element, $attributes) {

         $scope.supportsMultiple = $scope.$eval($attributes.supportsMultiple) || true
         $scope.maxFiles = $scope.$eval($attributes.maxFiles) || null;
         $scope.maxFileSizeKb = $scope.$eval($attributes.maxFileSizeKb) || null;
         $scope.accept = $attributes.accept || "*/*";

         $scope.onFilesProgress = $scope.onFilesProgress || function() {}
         $scope.onFilesError = $scope.onFilesError || function() {}

         function onInputChange() {
            var fileArray = []
            for (var i = 0; i < this.files.length; i++)
            {
               fileArray.push(this.files.item(i))
            }

            var fileProgress = 0;

            var promiseFnArray = fileArray.map(function(file) {
               return function(isNotify) {
                  var serialFnArray = [
                     function(existingData, index, forNotify) {
                        if (true === forNotify) {
                           return ProgressService(0, 1, "Processing EXIF data...");
                        } else {
                           return Promise(function(resolve, reject, notify) {
                              ImageService.processAndStripExifDataFromFile(file)
                              .then(function(data) {
                                 resolve({blob: data.blob, exifData: data.exifData});
                              })
                              .catch(function(e) {
                                 reject(e);
                              })
                           });
                        }
                     },
                     function(existingData, index, forNotify) {
                        if (true === forNotify) {
                           return ProgressService(0, file.size, "Loading file...");
                        } else {
                           return Promise(function(resolve, reject, notify) {
                              FileReaderService.readAsArrayBuffer(existingData.blob)
                              .then(function(result) {
                                 // A little trick here, we want to make
                                 // sure the update file model has the correct
                                 // data, post-exif processing.
                                 
                                 var fileModel = FileModel.fromFileObject({
                                    type: existingData.blob.type,
                                    size: existingData.blob.size,
                                    name: file.name
                                 }, null, result);
                                 
                                 fileModel.exifData = existingData.exifData;
                                 
                                 resolve({file: fileModel});
                              })
                              .catch(function(e) {
                                 reject(e);
                              });                
                           });    
                        }                    
                     }
                  ];
                  
                  
                  if (true === isNotify) {
                     return SerialPromise.getProgressSum(serialFnArray);
                  } else {
                     return SerialPromise.withNotify(serialFnArray,
                        null, ['file'], true);
                  }
               }
            })

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
                     $inputElement.attr('multiple', 'true');
                  } else {
                     $inputElement.attr('multiple', 'false');
                  }
                  $inputElement.attr('accept', $scope.accept);
                  
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