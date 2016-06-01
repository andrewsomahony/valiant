'use strict';

var registerService = require('services/register');

var imageResizer = require('html5-canvas-image-resizer');

var name = 'services.image';

registerService('factory', name, [require('services/data_url_service'),
                                  require('services/file_reader_service'),
                                  require('services/serial_promise'),
                                  require('services/progress'),
                                  require('services/promise'),
                                  require('services/exif_service'),
                                  require('services/dom_image_service'),
                                  require('services/error'),
                                  require('models/file'),
function(DataUrlService, FileReaderService, SerialPromise,
ProgressService, Promise, ExifService, DOMImageService,
ErrorService, FileModel) {
   function ImageService() {
      
   }
   
   ImageService.getImageDimensionsFromFileModel = function(fileModel) {
      return Promise(function(resolve, reject, notify) {
         DOMImageService.createImageFromFileModel(fileModel)
         .then(function(image) {
            resolve({
               width: image.width,
               height: image.height   
            });
         })
         .catch(function(error) {
            reject(error);
         })
      });
   }
   
   ImageService.getImageDimensionsFromDataUrl = function(dataUrl) {
      return Promise(function(resolve, reject, notify) {
         DOMImageService.createImageFromDataUrl(dataUrl)
         .then(function(image) {
            resolve({
               width: image.width,
               height: image.height   
            });
         })
         .catch(function(error) {
            reject(error);
         })
      });         
   }
   
   // This function scales an image and returns
   // a new one
   
   ImageService.scaleImageFromFileModel = function(fileModel, newWidth, newHeight) {
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
               ImageService.scaleImageFromDataUrl(existingData.dataUrl, newWidth, newHeight)
               .then(function(data) {
                  var newFileModel = FileModel.fromDataUrl(data.dataUrl, fileModel.name);
                  resolve({fileModel: newFileModel});
               })   
               .catch(function(error) {
                  reject(error);
               })
            });
         }
      });
      
      return SerialPromise.withNotify(promiseFnArray, null, ['fileModel'], true);      
   }
   
   ImageService.scaleImageFromDataUrl = function(dataUrl, newWidth, newHeight) {      
      return Promise(function(resolve, reject, notify) {
         var fileType = DataUrlService.getFileType(dataUrl).split("/")[1];

         var resizeFn = imageResizer(document.createElement('canvas'));
         
         resizeFn(dataUrl, newWidth, newHeight, 
            fileType, 
            function(newDataUrl) {
               resolve({dataUrl: newDataUrl});
            });            
      });
   }
   
   // This function reads the file,
   // sees if there's any EXIF data that requires
   // image modification (currently just orientation),
   // and applies it, then strips ALL the EXIF data
   // off of the image.
   
   // This does return the EXIF data for metadata reasons
   
   ImageService.processAndStripExifDataFromFileModel = function(fileModel) {
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
               ImageService.processAndStripExifDataFromDataUrl(existingData.dataUrl)
               .then(function(data) {
                  var newFileModel = FileModel.fromDataUrl(data.dataUrl, fileModel.name);
                  resolve({exifData: data.exifData, 
                           fileModel: newFileModel});
               })  
            });
         }
      })
      
      return SerialPromise.withNotify(promiseFnArray);
   }
   
   ImageService.processAndStripExifDataFromDataUrl = function(dataUrl) {
      var promiseFnArray = [];
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               ExifService.getExifDataFromDataUrl(dataUrl)
               .then(function(exifData) {
                  resolve({exifData: exifData})
               })
               .catch(function(error) {
                  reject(error);
               });
            });
         }
      });
      
      // This doubles as orienting as well as getting
      // rid of all the EXIF data.
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               ExifService.orientImageDataUrl(dataUrl, existingData.exifData)
               .then(function(data) {
                  resolve({dataUrl: data.dataUrl})
               })
               .catch(function(error) {
                  reject(error);
               });
            });
         }
      });
      
      return SerialPromise.withNotify(promiseFnArray);      
   }
   
   return ImageService;
}]);

module.exports = name;
