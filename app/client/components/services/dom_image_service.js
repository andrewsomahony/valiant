'use strict';

var registerService = require('services/register');

var name = 'services.dom_image';

registerService('factory', name, [require('services/file_reader_service'),
                                  require('services/promise'),
                                  require('services/progress'),
                                  require('services/serial_promise'),
                                  require('services/error'),
function(FileReaderService, Promise, ProgressService, SerialPromise,
ErrorService) {

   function DOMImageService() {
      
   }
   
   DOMImageService.isValidImageFileModel = function(fileModel) {
      return DOMImageService.createImageFromFileModel(fileModel);
   }
   
   DOMImageService.isValidImageDataUrl = function(dataUrl) {
      return DOMImageService.createImageFromDataUrl(dataUrl);
   }

   DOMImageService.createImageFromFileModel = function(fileModel) {
      var promiseFnArray = [];
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return fileModel.getDataUrl();
         }
      });
     
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               DOMImageService.createImageFromDataUrl(existingData.dataUrl) 
               .then(function(image) {
                   resolve({image: image});
               })
               .catch(function(error) {
                   reject(error);
               })
            });
         }
      });
      
      return SerialPromise.withNotify(promiseFnArray, null, ['image'], true);
   }
   
   DOMImageService.createImageFromDataUrl = function(dataUrl) {
      return Promise(function(resolve, reject, notify) {
         var image = new Image();
         
         image.onload = function() {
            if (!image.width &&
                !image.height) {
               reject(ErrorService.localError("Cannot create image!"));       
            } else {
               resolve(image);
            }
         }
         
         image.onerror = function() {
            reject(ErrorService.localError("Cannot create image!"));
         }

         image.src = dataUrl;
      });
   }

   DOMImageService.createImageFromUrl = function(url) {
       return DOMImageService.createImageFromDataUrl(url);
   }
   
   return DOMImageService;
}]);

module.exports = name;