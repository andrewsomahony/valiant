'use strict';

var registerService = require('services/register');

var name = 'services.profile_picture';

registerService('factory', name, [require('services/image_service'),
                                  require('services/dom_image_service'),
                                  require('models/file'),
                                  require('services/promise'),
                                  require('services/serial_promise'),
                                  require('services/progress'),
function(ImageService, DOMImageService, FileModel, Promise,
SerialPromise, ProgressService) {
   function ProfilePictureService() {
      
   }
   
   var maxProfilePictureWidth = 300;
   
   function calculateHeightForMaxProfilePictureWidth(originalWidth, originalHeight) {
      if (!originalHeight) {
         return 0;
      } else {
         var ratio = originalWidth / originalHeight;
         return maxProfilePictureWidth / ratio;
      }
   }
   
   ProfilePictureService.resizeProfilePictureFromFileModel = function(fileModel) {
      var promiseFnArray = [];
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               fileModel.getDataUrl()
               .then(function(dataUrl) {
                  resolve({dataUrl: dataUrl});
               })
               .catch(function(error) {
                  reject(error);
               })
            });
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               DOMImageService.createImageFromDataUrl(existingData.dataUrl)
               .then(function(domImage) {
                  resolve({domImage: domImage});
               })
               .catch(function(error) {
                  reject(error);
               })
            });
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               var newWidth = maxProfilePictureWidth;
               var newHeight = calculateHeightForMaxProfilePictureWidth(existingData.domImage.width, 
                  existingData.domImage.height);
                  
               ImageService.scaleImageFromDataUrl(existingData.dataUrl, newWidth, newHeight)
                  .then(function(data) {
                     FileModel.fromBlob(data.blob, fileModel.name, fileModel.exifData)
                     .then(function(fileModel) {
                        resolve({
                           fileModel: fileModel,
                           metadata: {
                              width: newWidth,
                              height: newHeight
                           }
                        });
                     })
                     .catch(function(error) {
                        reject(error);
                     });
                  })
                  .catch(function(error) {
                     reject(error);
                  })
            });
         }
      });

      return SerialPromise.withNotify(promiseFnArray);
   }
   
   return ProfilePictureService;
}]);

module.exports = name;
