'use strict';

var registerService = require('services/register');

var name = 'services.question_preview_picture';

registerService('factory', name, [require('services/canvas_service'),
                                  require('services/picture_service'),
                                  require('models/file'),
function(CanvasService, PictureService, FileModel) {
   function QuestionPreviewPictureService() {

   }
   
   QuestionPreviewPictureService.getQuestionPreviewPicture = function(question) {
      return Promise(function(resolve, reject, notify) {
         var validVideos = utils.map(question.videos, function(videoModel) {
            if (videoModel.hasMedia() &&
                videoModel.thumbnail.hasMedia()) {
               return videoModel;
            } else {
               return null;
            }
         });

         var validPictures = utils.map(question.pictures, function(pictureModel) {
            if (pictureModel.hasMedia()) {
               return pictureModel;
            } else {
               return null;
            }
         });

         var hasYoutubeVideo = question.youtube_video.hasMedia();
      });
   }

   return QuestionPreviewPictureService;
}]);

module.exports = name;