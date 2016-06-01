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
   
   PictureProportionalResizeService.resizePicture = function(picture, newWidth, newHeight) {
      return Promise(function(resolve, reject, notify) {
         if (newWidth) {
            newHeight = calculateHeightForPictureWidth(picture.getWidth(), 
                  picture.getHeight(), newWidth);
         } else if (newHeight) {
            newWidth = calculateWidthForPictureHeight(picture.getWidth(),
                  picture.getHeight(), newHeight);
         } else {
            reject(ErrorService.localError("PictureProportionalResizeService: newWidth and newHeight both null!"));
         }
            
         var blob = picture.file_model.toBlob();
                              
         ImageService.scaleImageFromFile(blob, newWidth, newHeight)
            .then(function(data) {
               FileModel.fromBlob(data.blob)
               .then(function(newFileModel) {
                  picture.setFileModel(newFileModel);
                  picture.setMetadata({
                     width: newWidth,
                     height: newHeight
                  });
            
                  resolve(picture);
               })
               .catch(function(error) {
                  reject(error);
               });
            })
            .catch(function(error) {
               reject(error);
            });
      });
   }
   
   return PictureProportionalResizeService;
}]);

module.exports = name;

