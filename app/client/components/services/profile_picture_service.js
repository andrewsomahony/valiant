'use strict';

var registerService = require('services/register');

var name = 'services.profile_picture';

registerService('factory', name, [require('services/picture_proportional_resize_service'),
function(PictureProportionalResizeService) {
   function ProfilePictureService() {
      
   }
   
   var maxProfilePictureWidth = 300;
   
   ProfilePictureService.resizeProfilePictureFromFileModel = function(fileModel) {
      return PictureProportionalResizeService.resizePictureFromFileModel(fileModel, 
                  maxProfilePictureWidth);
   }
   
   return ProfilePictureService;
}]);

module.exports = name;
