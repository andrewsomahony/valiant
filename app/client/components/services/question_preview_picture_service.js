'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.question_preview_picture';

registerService('factory', name, [require('services/canvas_service'),
                                  require('services/picture_service'),
                                  require('services/random_number_service'),
                                  require('models/file'),
                                  require('services/question_type_service'),
function(CanvasService, PictureService, RandomNumberService, FileModel,
QuestionTypeService) {
   function QuestionPreviewPictureService() {

   }

   var questionTypePictures = {};

   QuestionTypeService.getQuestionTypes().forEach(function(questionType) {
      questionTypePictures[questionType.name || "Custom"] = 
         new PictureModel({url: questionType.picture_url});
   });

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
         var backgroundPictureRect = [];
         var backgroundAlpha = 1;
         var backgroundColor = "white";

         var foregroundPicture = null;
         var foregroundPictureRect = [];

         if (videoModel) {
            backgroundPicture = videoModel.thumbnail;

            if (pictureModel) {
               foregroundPicture = pictureModel;
            }
         } else {
            if (pictureModel) {
               backgroundPicture = pictureModel;
            } else {
               if (question.custom_topic) {
                  backgroundPicture = questionTypePictures['Custom'];
               } else {
                  backgroundPicture = questionTypePictures[question.topic];
                  if (!backgroundPicture) {
                      throw new Error("Invalid question topic " + question.topic);
                  }
               }
            }
         }

         if (backgroundPicture) {
             // If the background picture is a portrait, then we
             // draw it with black bars around it.  Otherwise, just fill
             // the entire canvas with it.

            if (backgroundPicture.getHeight() > backgroundPicture.getWidth()) {
               backgroundColor = "black";

               backgroundPictureRect[0] = (canvasModel.width - backgroundPicture.getWidth()) / 2;
               backgroundPictureRect[1] = 0;
               backgroundPictureRect[2] = canvasModel.width / 2;
               backgroundPictureRect[3] = canvasModel.height;
            } else {
               backgroundColor = "white";
               backgroundAlpha = 0.5;

               backgroundPictureRect[0] = 0;
               backgroundPictureRect[1] = 0;
               backgroundPictureRect[2] = canvasModel.width;
               backgroundPictureRect[3] = canvasModel.height;
            }
         }

         if (foregroundPicture) {
            // If the foreground picture is a portrait, fill half of the canvas
            // with it, otherwise only fill a quarter of it.

            if (foregroundPicture.getHeight() > foregroundPicture.getWidth()) {
               foregroundPictureRect[0] = canvasModel.width / 2;
               foregroundPictureRect[1] = 0;
               foregroundPictureRect[2] = canvasModel.width / 2;
               foregroundPictureRect[3] = canvasModel.height;
            } else {
               foregroundPictureRect[0] = canvasModel.width / 2;
               foregroundPictureRect[1] = canvasModel.height / 2;
               foregroundPictureRect[2] = canvasModel.width / 2;
               foregroundPictureRect[3] = canvasModel.height / 2;
            }
         }

         CanvasService.fillCanvas(canvasModel, backgroundColor);

         CanvasService.setCanvasAlpha(canvasModel, backgroundAlpha);

         if (backgroundPicture) {
            CanvasService.drawPictureToCanvas(canvasModel,
               backgroundPicture, backgroundPictureRect[0],
               backgroundPictureRect[1], backgroundPictureRect[2],
               backgroundPictureRect[3]);
         }

         CanvasService.setCanvasAlpha(canvasModel, 1);

         if (foregroundPicture) {
            CanvasService.drawPictureToCanvas(canvasModel,
              foregroundPicture, 
              foregroundPictureRect[0], foregroundPictureRect[1],
              foregroundPictureRect[2], foregroundPictureRect[3]);
         }

         if (youtubeModel) {
            // Draw the youtube logo in the bottom
            // right corner.
            
            var youtubePicture = new PictureModel({
               url: "/images/youtube_logo.png"
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