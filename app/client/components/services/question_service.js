'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.question';

registerService('factory', name, [require('services/http_service'),
                                  require('services/parallel_promise'),
                                  require('services/serial_promise'),
                                  require('services/promise'),
                                  require('services/progress'),
                                  require('services/media_service'),
                                  require('services/question_preview_picture_service'),
function(HttpService, ParallelPromise, SerialPromise, Promise, Progress,
MediaService, QuestionPreviewPictureService) {
   function QuestionService() {
      
   }
   
   QuestionService.ask = function(questionModel) {
      var serialPromiseFnArray = [
         function(existingData, index, forNotify) {
            return Promise(function(resolve, reject, notify) {
               if (false === forNotify) {
                  QuestionPreviewPictureService.getQuestionPreviewPicture(questionModel)
                  .then(function(picture) {
                     questionModel.preview_pictures[0] = picture;
                     resolve();
                  })
                  .catch(function(error) {
                     reject(error);
                  })
               }
            });
         },
         function(existingData, index, forNotify) {
            var pictureUploadFnArray = utils.map(questionModel.pictures, function(pictureModel) {
               return function(forNotify) {
                  return MediaService.uploadMedia('question_picture', pictureModel, forNotify);
               }
            });
      
            var videoUploadFnArray = utils.map(questionModel.videos, function(videoModel) {
               return function(forNotify) {
                  return MediaService.uploadMedia('question_video', videoModel, forNotify);
               }
            });

            var previewPictureUploadFnArray = utils.map(questionModel.preview_pictures, function(previewPictureModel) {
               return function(forNotify) {
                  return MediaService.uploadMedia('question_preview', previewPictureModel, forNotify);
               }
            });
      
            var mediaUploadFnArray = utils.merge(pictureUploadFnArray, videoUploadFnArray, previewPictureUploadFnArray);

            if (true === forNotify) {
               return ParallelPromise.getProgressSum(mediaUploadFnArray);   
            } else {
               return ParallelPromise.withNotify(mediaUploadFnArray)
            }
         },
         function(existingData, index, forNotify) {
            // Upload to the server.
            // At this point, all models are filled with their correct
            // URL's and such from the media uploader.
            if (false === forNotify) {
               return Promise(function(resolve, reject, notify) {
                  // Create the new question here
                  resolve({question: questionModel});
               })
            }
         }
      ];

      return Promise(function(resolve, reject, notify) {
         SerialPromise.withNotify(serialPromiseFnArray, null, ['question'], true)
         .then(function(question) {
            resolve(question);
         }, null, function(progress) {
            notify(progress);
         })
         .catch(function(error) {
            reject(error);
         });
      });
   }
   
   return QuestionService;
}])

module.exports = name;