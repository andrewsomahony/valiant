'use strict';

var registerService = require('services/register');

var name = 'services.file_type_validator';

registerService('factory', name, [require('services/mime_service'),
                       require('services/promise'),
                       require('services/dom_image_service'),
function(MimeService, Promise, DOMImageService) {
   function FileTypeValidatorService() {
      
   }
   
   FileTypeValidatorService.validateFile = function(file, mimeType) {
      return Promise(function(resolve, reject, notify) {
         if (!MimeService.checkMimeType(file.type, mimeType)) {
            reject();
         } else {
            var baseType = MimeService.getBaseMimeType(file.type);
            
            if ('image' === baseType) {
               DOMImageService.isValidImageFile(file)
               .then(function() {
                  resolve();
               })
               .catch(function() {
                  reject();
               });
            } else if ('video' === baseType) {
               // TODO: Unimplemented
               resolve();
            } else if ('audio' === baseType) {
               // TODO: Unimplemented
               resolve();
            } else {
               resolve();
            }
         }
      });
   }
   
   return FileTypeValidatorService;
}]);

module.exports = name;