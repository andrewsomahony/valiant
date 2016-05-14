'use strict';

var registerService = require('services/register');

var name = 'services.profile_picture';

registerService('factory', name, [require('services/image_service'),
                                  require('models/file'),
                                  require('services/promise'),
function(ImageService, FileModel, Promise) {
   function ProfilePictureService() {
      
   }
   
   var maxProfilePictureWidth = 300;
   
   ProfilePictureService.resizeProfilePictureFromFileModel = function(fileModel) {
      return Promise(function(resolve, reject, notify) {
         fileModel.getDataUrl()
         .then(function(dataUrl) {
            ImageService.scaleImageFromDataUrl(dataUrl, 100, 100)
            .then(function(data) {
               resolve(FileModel.fromBlob(data.blob, fileModel.name));
            })
            .catch(function(error) {
               reject(error);
            })
         });         
      });
   }
   
   return ProfilePictureService;
}]);

module.exports = name;
