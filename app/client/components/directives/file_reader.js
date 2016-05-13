'use strict';

var registerDirective = require('directives/register');

var name = 'fileReader';

registerDirective(name, [require('models/file'),
                         require('services/promise'),
                         require('services/parallel_promise'),
                         require('services/progress'),
                         require('services/file_reader_service'),
function(FileModel, Promise, ParallelPromise, ProgressService,
FileReaderService) {
   return {
      restrict: 'E',
      template: "",//<input id=\"filePicker\" class=\"file_picker\" type=\"file\" accept=\"image/\*\" name=\"files[]\" ng-disabled=\"disabled\">",
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
                  if (true === isNotify) {
                     return ProgressService(0, file.size, "Loading file...")
                  }
                  
                  FileReaderService.processExifData(file);

                  return Promise(function(resolve, reject, notify) {
                     FileReaderService.readAsArrayBuffer(file)
                     .then(function(result) {
                        resolve(FileModel.fromFileObject(file, null, result));
                     })
                     .catch(function(e) {
                        reject(e);
                     });                
                  })
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