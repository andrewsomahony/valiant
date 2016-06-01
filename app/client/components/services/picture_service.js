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
      var picture = new PictureModel();
      var blob = fileModel.toBlob();
      
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
                  ImageService.processAndStripExifDataFromFile(blob)
                  .then(function(data) {
                     resolve({exif: data});
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
                  ImageService.getImageDimensionsFromFile(existingData.exif.blob)
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
                  var newBlob = existingData.exif.blob;
                  
                  FileReaderService.readAsArrayBuffer(newBlob)
                  .then(function(arrayBuffer) {
                     fileModel = FileModel.fromFileObject({
                        type: newBlob.type,
                        size: newBlob.size,
                        name: fileModel.name
                     }, null, arrayBuffer);
                                          
                     picture.setFileModel(fileModel);
                     picture.setMetadata(existingData.exif.exifData);
                     picture.setMetadata(existingData.dimensions);
                     picture.setType(newBlob.type);
                     
                     resolve({picture: picture});                 
                  })
                  .catch(function(error) {
                     reject(error);
                  });
               });
            }
         }
      ];
      
      return SerialPromise.withNotify(promiseFnArray, null, ['picture'], true);
   }
   
   return PictureService;
}])

module.exports = name;