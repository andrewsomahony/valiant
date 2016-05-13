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
function(DataUrlService, FileReaderService, SerialPromise,
ProgressService, Promise, ExifService) {
   function ImageService() {
      
   }
   
   // This function reads the file,
   // sees if there's any EXIF data that requires
   // image modification (currently just orientation),
   // and applies it, then strips ALL the EXIF data
   // off of the image.
   
   ImageService.processAndStripExifData = function(file) {
      var promiseFnArray = [];
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);   
         } else {
            return Promise(function(resolve, reject, notify) {
               FileReaderService.readAsDataUrl(file)
               .then(function(dataUrl) {
                  resolve({dataUrl: dataUrl});
               }) 
               .catch(function(e) {
                  reject(e);
               });         
            });
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               ExifService.getExifDataFromDataUrl(existingData.dataUrl)
               .then(function(data) {
                  resolve({exifData: data.exifData})
               })
               .catch(function(error) {
                  reject(error);
               });
            });
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               ExifService.orientImageDataUrl(existingData.dataUrl, existingData.exifData)
               .then(function(data) {
                  resolve({dataUrl: data.dataUrl})
               })
               .catch(function(error) {
                  reject(error);
               });
            });
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               if (!existingData.dataUrl) {
                  reject(ErrorService.localError("Missing data url!"));
               } else {
                  var blob = DataUrlService.dataUrlToBlob(existingData.dataUrl);
                  if (!blob) {
                     reject(ErrorService.localError("Cannot obtain non-exif file data!"))
                  } else {
                     resolve({blob: blob});
                  }                  
               }
            });
         }
      });
      
      return SerialPromise.withNotify(promiseFnArray);
   }
   
   return ImageService;
}])


module.exports = name;
