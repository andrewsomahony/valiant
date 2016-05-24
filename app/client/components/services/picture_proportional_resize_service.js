'use strict';

var registerService = require('services/register');

var name = 'services.picture_proportional_resize';

registerService('factory', name, [require('services/image_service'),
                                  require('services/dom_image_service'),
                                  require('models/file'),
                                  require('services/promise'),
                                  require('services/serial_promise'),
                                  require('services/progress'),
                                  require('services/error'),
function(ImageService, DOMImageService, FileModel, Promise,
SerialPromise, ProgressService, ErrorService) {
   function PictureProportionalResizeService() {
      
   }
   
   //var maxProfilePictureWidth = 300;
   
   function calculateHeightForPictureWidth(originalWidth, originalHeight, newWidth) {
      if (!originalHeight) {
         return 0;
      } else {
         var ratio = originalWidth / originalHeight;
         return newWidth / ratio;
      }
   }
   
   function calculateWidthForPictureHeight(originalWidth, originalHeight, newHeight) {
      if (!originalHeight) {
         return 0;
      } else {
         var ratio = originalWidth / originalHeight;
         return ratio * newHeight;
      }
   }
   
   PictureProportionalResizeService.resizePictureFromFileModel = function(fileModel, newWidth, newHeight) {
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
               if (newWidth) {
                  newHeight = calculateHeightForPictureWidth(existingData.domImage.width, 
                     existingData.domImage.height, newWidth);
               } else if (newHeight) {
                  newWidth = calculateWidthForPictureHeight(existingData.domImage.width,
                     existingData.domImage.height, newHeight);
               } else {
                  reject(ErrorService.localError("PictureProportionalResizeService: newWidth and newHeight both null!"));
               }
                  
               ImageService.scaleImageFromDataUrl(existingData.dataUrl, newWidth, newHeight)
                  .then(function(data) {
                     FileModel.fromBlob(data.blob, fileModel.name)
                     .then(function(newFileModel) {
                        newFileModel.metadata = {
                           width: newWidth,
                           height: newHeight
                        };
                        newFileModel.exifData = fileModel.exifData;
                        
                        resolve({
                           fileModel: newFileModel,
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
   
   return PictureProportionalResizeService;
}]);

module.exports = name;

