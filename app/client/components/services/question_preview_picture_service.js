'use strict';

var registerService = require('services/register');

var name = 'services.question_preview_picture';

registerService('factory', name, [require('services/canvas_service'),
                                  require('services/picture_service'),
                                  require('services/random_number_service'),
                                  require('models/file'),
function(CanvasService, PictureService, RandomNumberService, FileModel) {
   function QuestionPreviewPictureService() {

   }

   var pictureWidth = 320;
   var pictureHeight = 200;

   var youtubeLogoWidth = 80;
   var youtubeLogoHeight = 80;
   
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

         var videoModel = validVideos ? 
            validVideos[RandomNumberService.randomNumber(0, validVideos.length - 1)]
            : null;

         var pictureModel = validPictures ?
            validPictures[RandomNumberService.randomNumber(0, validPictures.length - 1)];
         
         var youtubeModel = hasYoutubeVideo ? question.youtube_video : null;

         var canvasModel = CanvasService.createCanvasModel(pictureWidth,
            pictureHeight);

         var backgroundPicture = null;
         var backgroundAlpha = 1;
         var backgroundColor = "white";

         var foregroundPicture = null;

         if (videoModel) {
            backgroundPicture = videoModel.thumbnail;

            if (pictureModel) {
               foregroundPicture = pictureModel;
            }
         } else {
            if (pictureModel) {
               backgroundPicture = pictureModel;
            } else {

            }
         }

         if (backgroundPicture) {
            if (backgroundPicture.getHeight() > backgroundPicture.getWidth()) {
               backgroundColor = "black";
            } else {
               backgroundColor = "white";
               backgroundAlpha = 0.5;
            }
         }

         CanvasService.fillCanvas(canvasModel, backgroundColor);

         if (youtubeModel) {
            // Draw the youtube logo in the bottom
            // right corner.
            
            var youtubePicture = new PictureModel({
               url: "images/youtube_logo.png"
            });

            CanvasService.drawPictureToCanvas(canvasModel, youtubePicture,
               canvasModel.width - youtubeLogoWidth,
               canvasModel.height - youtubeLogoHeight,
               youtubeLogoWidth, youtubeLogoHeight);
         }   
      });
   }

   return QuestionPreviewPictureService;
}]);

module.exports = name;