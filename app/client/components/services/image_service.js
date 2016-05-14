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
   
   // This function scales an image and returns
   // a new one
   
   ImageService.scaleImageFromFile = function(file) {
      var promiseFnArray = [];
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);   
         } else {
            return FileReaderService.readAsDataUrlPromiseHelper(file);
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return ImageService.scaleImageFromDataUrl(existingData.dataUrl);
         }
      });
      
      return SerialPromise.withNotify(promiseFnArray);      
   }
   
   ImageService.scaleImageFromDataUrl = function(dataUrl, newWidth, newHeight) {
      var promiseFnArray = [];
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1, "Resizing image...");
         } else {
            return Promise(function(resolve, reject, notify) {
               var fileType = DataUrlService.getFileType(dataUrl);
         
               imageResizer(dataUrl, newWidth, newHeight, 
                  fileType, function(canvas) {
                     var newDataUrl = canvas.toDataURL(fileType);
                     resolve({dataUrl: newDataUrl});
               });
            });
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1, "Converting image...");
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
      })
      
      return SerialPromise.withNotify(promiseFnArray);
   }
   
   // This function reads the file,
   // sees if there's any EXIF data that requires
   // image modification (currently just orientation),
   // and applies it, then strips ALL the EXIF data
   // off of the image.
   
   ImageService.processAndStripExifDataFromFile = function(file) {
      var promiseFnArray = [];
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);   
         } else {
            return ImageService.readFileAsDataUrl(file);
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return ImageService.processAndStripExifDataFromDataUrl(existingData.dataUrl);
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
