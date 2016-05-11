'use strict';

var registerService = require('services/register');

var name = 'services.s3_sign_url_service';

registerService('factory', name, 
                 [require('services/api_url'),
                 require('services/promise'),
                 require('services/error'),
                 require('services/http_service'),
function(ApiUrlService, Promise, ErrorService, HttpService) {
   function AS3SignUrlService() {

   }

   AS3SignUrlService.getSignedPutUrl = function(uploadType, fileType) {
       return Promise(function(resolve, reject, notify) {
          HttpService.get(ApiUrlService([
              {
                name: 'S3'
              },
              {
                name: 'SignedUrl'
              }
          ]), {
              upload_type: uploadType,
              file_type: fileType
          })
          .then(function(data) {
              resolve(data.data);
          })
          .catch(function(e) {
              reject(e);
          })
       });
   }

   return AS3SignUrlService;
}])

module.exports = name;