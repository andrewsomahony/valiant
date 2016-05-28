'use strict';

var registerService = require('services/register');

var name = 'services.question';

registerService('factory', name, [require('services/http_service'),
                                  require('services/parallel_promise'),
                                  require('services/serial_promise'),
                                  require('services/promise'),
                                  require('services/progress'),
                                  require('services/media_service'),
function(HttpService, ParallelPromise, SerialPromise, Promise, Progress,
MediaService) {
   function QuestionService() {
      
   }
   
   QuestionService.getSelectableQuestionTypes = function() {
      return [
         "Swimming"
      ];
   }
   
   QuestionService.ask = function(questionModel) {      
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
      
      var mediaUploadFnArray = utils.merge(pictureUploadFnArray, videoUploadFnArray);
      
      var serialPromiseFnArray = [
         function(existingData, index, forNotify) {
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
            return Promise(function(resolve, reject, notify) {
               resolve();
            })
         }
      ];
   }
   
   return QuestionService;
}])

module.exports = name;