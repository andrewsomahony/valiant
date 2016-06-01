'use strict';

var registerService = require('services/register');

var name = 'services.picture';

registerService('factory', name, [require('models/picture'),
                                  require('models/file'),
                                  require('services/image_service'),
                                  require('services/promise'),
                                  require('services/serial_promise'),
                                  require('services/progress'),
                                  require('services/file_reader_service'),
function(PictureModel, FileModel, ImageService, Promise,
SerialPromise, ProgressService, FileReaderService) {
   function PictureService() {
      
   }
   
   PictureService.getPictureFromFileModel = function(fileModel) {
      var promiseFnArray = [
         // We do the EXIF stuff first, so that
         // if there's some sort of orientation
         // change, then we get the correct dimensions
         // afterwards, instead of before.
         
         function(existingData, index, forNotify) {
            if (true === forNotify) {
               return ProgressService(0, 1);
            } else {
               return Promise(function(resolve, reject, notify) {
                  ImageService.processAndStripExifDataFromFileModel(fileModel)
                  .then(function(data) {
                     resolve(data);
                  })
                  .catch(function(error) {
                     reject(error);
                  })
               });
            }
         },
                  
         function(existingData, index, forNotify) {
            if (true === forNotify) {
               return ProgressService(0, 1);
            } else {
               return Promise(function(resolve, reject, notify) {
                  ImageService.getImageDimensionsFromFileModel(existingData.fileModel)
                  .then(function(data) {
                     resolve({dimensions: data});
                  })
                  .catch(function(error) {
                     reject(error);
                  });
               });
            }
         },

         function(existingData, index, forNotify) {
            if (true === forNotify) {
               return ProgressService(0, 1);
            } else {
               return Promise(function(resolve, reject, notify) {                  
                  var picture = new PictureModel();
                                       
                  picture.setFileModel(existingData.fileModel);
                  picture.setMetadata(existingData.exifData);
                  picture.setMetadata(existingData.dimensions);
                                       
                  resolve({picture: picture});                 
               });
            }
         }
      ];
      
      return SerialPromise.withNotify(promiseFnArray, null, ['picture'], true);
   }
   
   return PictureService;
}])

module.exports = name;