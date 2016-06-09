'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.media';

registerService('factory', name, [require('models/picture'),
                                  require('models/video'),
                                  require('services/s3_uploader_service'),
                                  require('services/promise'),
                                  require('services/progress'),
function(PictureModel, VideoModel, S3UploaderService,
Promise, Progress) {
   function MediaService() {
      
   }
   
   function mediaModelIsValid(mediaModel) {
      return utils.objectIsClassy(mediaModel, VideoModel) ||
             utils.objectIsClassy(mediaModel, PictureModel);
   }
   
   MediaService.uploadMedia = function(uploadType, mediaModel, forNotify) {
      if (false === mediaModelIsValid(mediaModel)) {
         throw new Error("MediaService.uploadMedia: Invalid media model!");
      } else {
         if (true === forNotify) {
            if (!mediaModel.file_model) {
               return Progress(0, 1);
            } else {
               return S3UploaderService.getProgressInfo(uploadType, mediaModel.file_model);
            }
         } else {
            // Upload the video thumbnail as well?
            
            return Promise(function(resolve, reject, notify) {
               if (!mediaModel.file_model) {
                  resolve();
               } else {
                  S3UploaderService(uploadType, mediaModel.file_model)
                  .then(function(data) {
                     mediaModel.url = data.url;
                     mediaModel.file_model = null;
                     mediaModel.upload_progress = null;
                     resolve();
                  }, null, function(progress) {
                     mediaModel.upload_progress = progress;
                     notify(progress);
                  })
                  .catch(function(error) {
                     mediaModel.upload_progress = null;
                     reject(error);
                  })
               }
            });
         }
      }
   }
   
   return MediaService;
}])

module.exports = name;