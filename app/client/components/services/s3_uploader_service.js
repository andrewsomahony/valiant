'use strict';

var registerService = require('services/register');

var name = 'services.s3_uploader_service';

registerService('factory', name, 
                 [require('models/file'),
                  require('services/s3_sign_url_service'),
                  require('services/promise'),
                  require('services/serial_promise'),
                  require('services/error'),
                  require('services/progress'),
function(FileModel, S3SignUrlService, Promise, 
   SerialPromise, ErrorService, ProgressService) { 

   function UploadHelper(fileModel, s3PutUrl, resolve, reject, notify) {
      function uploadProgress(e) {
         notify(ProgressService(e.loaded, e.total))
      }

      function uploadComplete(e) {
         var xhr = e.srcElement || e.target;
         resolve({url: s3PutUrl.public_url})
      }

      function uploadFailed(e) {
         var xhr = e.srcElement || e.target;
         reject(ErrorService.localError("S3 Upload Failed " + xhr.status));
      }

      function uploadCancelled(e) {
         var xhr = e.srcElement || e.target;
         reject(ErrorService.localError("S3 Upload Failed " + xhr.status));
      }

      var xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', uploadProgress, false);
      xhr.addEventListener('load', uploadComplete, false);
      xhr.addEventListener('error', uploadFailed, false);
      xhr.addEventListener('abort', uploadCancelled, false);

      xhr.open('PUT', s3PutUrl.signed_url);
      xhr.setRequestHeader('x-amz-acl', s3PutUrl.acl);

      xhr.send(fileModel.toBlob());      
   }

   function GetS3PromiseFnArray(uploadType, fileModel) {
      var promiseFnArray = [
         function(existingData, index, forNotify) {
            if (true === forNotify) {
               return ProgressService(0, 1, "Preparing upload...");
            }

            return Promise(function(resolve, reject) {
               S3SignUrlService.getSignedPutUrl(uploadType, fileModel.type)
               .then(function(data) {
                  resolve({s3Options: data});
               })
               .catch(function(error) {
                  reject(error)
               })
            })
         },
         function(existingData, index, forNotify) {
            if (true === forNotify)
            {
               // !!! Technically, this doesn't quite work:
               // !!! the file size is not the full size of the AJAX request
               // !!! that we are doing to make, as it includes MIME data
               // !!! and such.

               // !!! This doesn't affect anything though, just the initial calculation
               return ProgressService(0, fileModel.size, "Uploading...");
            }

            return Promise(function(resolve, reject, notify) {
               UploadHelper(fileModel, existingData.s3Options, resolve, reject, notify)
            })
         }
      ];
      
      return promiseFnArray;
   }

   function AS3UploaderService(uploadType, fileModel) {
      return SerialPromise.withNotify(
         GetS3PromiseFnArray(uploadType, fileModel), ['s3Options']);
   }

   AS3UploaderService.getProgressInfo = function(uploadType, fileModel) {
      return SerialPromise.getProgressSum(
         GetS3PromiseFnArray(uploadType, fileModel))
   }

   return AS3UploaderService;
}]);

module.exports = name;