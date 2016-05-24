'use strict';

var registerService = require('services/register');

var EXIF = require('exif-js');
var exifOrient = require('exif-orient');

var name = 'services.exif';

registerService('factory', name, [require('services/file_reader_service'),
                                  require('services/data_url_service'),
                                  require('services/dom_image_service'),
                                  require('services/serial_promise'),
                                  require('services/promise'),
                                  require('services/progress'),
function(FileReaderService, DataUrlService, DOMImageService, SerialPromise,
Promise, ProgressService) {
   function ExifService() {
      
   }
   
   ExifService.getExifDataFromFile = function(file) {
      var promiseFnArray = [
         function(existingData, index, forNotify) {
            if (true === forNotify) {
               return ProgressService(0, 1, "Loading file...");
            } else {
               return FileReaderService.readAsDataUrlPromiseHelper(file);
            }
         },
         function(existingData, index, forNotify) {
            if (true === forNotify) {
               return ProgressService(0, 1, "Extracting EXIF data...");
            } else {
               return ExifService.getExifDataFromDataUrl(existingData.dataUrl);
            }
         }
      ];
      
      return SerialPromise.withNotify(promiseFnArray);
   }
   
   ExifService.getExifDataFromDataUrl = function(dataUrl) {
      return Promise(function(resolve, reject, notify) {
         console.log("Trying DOM image");
         DOMImageService.createImageFromDataUrl(dataUrl)
         .then(function(image) {
            EXIF.getData(image, function() {
               resolve({exifData: image.exifdata});
            });           
         })
         .catch(function(error) {
            reject(error);
         });
      });
   }
   
   ExifService.orientImageFile = function(file, exifData) {
      var promiseFnArray = [
         function(existingData, index, forNotify) {
            if (true === forNotify) {
               return ProgressService(0, 1, "Loading file...");
            } else {
               if (!exifData) {
                  return ExifService.getExifDataFromFile(file);
               } else {
                  return FileReaderService.readAsDataUrlPromiseHelper(file);
               }
            }
         },
         function(existingData, index, forNotify) {
            if (true === forNotify) {
               return ProgressService(0, 1, "Orienting image...");
            } else {
               return ExifService.orientImageDataUrl(existingData.dataUrl, exifData || existingData.exifData);
            }
         }
      ];
      
      return SerialPromise.withNotify(promiseFnArray);
   }
   
   ExifService.orientImageDataUrl = function(dataUrl, exifData) {
      return Promise(function(resolve, reject, notify) {
         if (!exifData.Orientation) {
            resolve({dataUrl: dataUrl});
         } else {
            exifOrient(dataUrl, exifData.Orientation, function(error, canvas) {
               if (error) {
                  reject(ErrorService.localError("Cannot render non-exif image!"));
               } else {
                  var newDataUrl = canvas.toDataURL(DataUrlService.getFileType(dataUrl));
                  
                  if (!newDataUrl) {
                     reject(ErrorService.localError("Cannot obtain non-exif image!"));
                  } else {
                     resolve({dataUrl: newDataUrl});
                  }
               }
            });
         }
      });
   }
   
   // Parsing services
   
   ExifService.parseLatitudeAndLongitude = function(exifData) {
      var latitudes = exifData['GPSLatitude'];
      var latitudeRef = exifData['GPSLatitudeRef'];
      
      var longitudes = exifData['GPSLongitude'];
      var longitudeRef = exifData['GPSLongitudeRef'];
      
      if (!latitudes || !longitudes ||
          !latitudeRef || !longitudeRef) {
         return null;       
      }
      
      var latitude = latitudes[0] + 
                     latitudes[1] / 60 + 
                     latitudes[2] / 3600;
      
      if ("N" !== latitudeRef) {
         latitude = 0 - latitude;
      }              
                     
      var longitude = longitudes[0] +
                      longitudes[1] / 60 +
                      longitudes[2] / 3600;
   
      if ("E" !== longitudeRef) {
         longitude = 0 - longitude;
      }
   
      return "" + latitude + "," + longitude;
   }
   
   return ExifService;
}]);

module.exports = name;