'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.question_preview_picture';

registerService('factory', name, [require('services/canvas_service'),
                                  require('services/picture_service'),
                                  require('services/random_number_service'),
                                  require('models/file'),
                                  require('models/picture'),
                                  require('services/question_type_service'),
                                  require('services/promise'),
                                  require('services/serial_promise'),
                                  require('services/picture_proportional_resize_service'),
function(CanvasService, PictureService, RandomNumberService, FileModel,
PictureModel, QuestionTypeService, Promise, SerialPromise,
PictureProportionalResizeService) {
   function QuestionPreviewPictureService() {

   }

   var questionTypePictures = {};

   QuestionTypeService.getQuestionTypes().forEach(function(questionType) {
      questionTypePictures[questionType.name || "Custom"] = 
         new PictureModel({url: questionType.picture_url});
   });

   var pictureWidth = 320;
   var pictureHeight = 200;

   var youtubeLogoWidth = 50;
   var youtubeLogoHeight = 50;
   
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

         var videoModel = validVideos.length ? 
            validVideos[RandomNumberService.randomNumber(0, validVideos.length - 1)]
            : null;

         var pictureModel = validPictures.length ?
            validPictures[RandomNumberService.randomNumber(0, validPictures.length - 1)]
            : null;
         
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

               // We can have big images here, so we need to figure out
               // how to proportionally scale them so they can fit onto the canvas.

               var newWidth = PictureProportionalResizeService.calculateWidthForPictureHeight(
                   backgroundPicture.getWidth(), backgroundPicture.getHeight(), canvasModel.height);

               backgroundPictureRect[0] = (canvasModel.width - newWidth) / 2;
               backgroundPictureRect[1] = 0;
               backgroundPictureRect[2] = newWidth;
               backgroundPictureRect[3] = canvasModel.height;
            } else {
               backgroundColor = "white";

               if (foregroundPicture || youtubeModel) {
                  backgroundAlpha = 0.5;
               } else {
                  backgroundAlpha = 1;
               }

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
               // We can have big images here, so we need to figure out
               // how to proportionally scale them so they can fit onto the canvas.

               var newWidth = PictureProportionalResizeService.calculateWidthForPictureHeight(
                   foregroundPicture.getWidth(), foregroundPicture.getHeight(), canvasModel.height);

               foregroundPictureRect[0] = canvasModel.width - newWidth;
               foregroundPictureRect[1] = 0;
               foregroundPictureRect[2] = newWidth;
               foregroundPictureRect[3] = canvasModel.height;
            } else {
               foregroundPictureRect[0] = canvasModel.width / 2;
               foregroundPictureRect[1] = canvasModel.height / 2;
               foregroundPictureRect[2] = canvasModel.width / 2;
               foregroundPictureRect[3] = canvasModel.height / 2;
            }
         }

         CanvasService.fillCanvas(canvasModel, backgroundColor);
         
         var serialFnArray = [
             function() {
                return Promise(function(resolve, reject, notify) {
                   if (backgroundPicture) {
                      CanvasService.setCanvasAlpha(canvasModel, backgroundAlpha);
                      CanvasService.drawPictureToCanvas(canvasModel,
                         backgroundPicture, backgroundPictureRect[0],
                         backgroundPictureRect[1], backgroundPictureRect[2],
                         backgroundPictureRect[3])
                      .then(function() {
                         resolve();
                      })
                      .catch(function(error) {
                         reject(error);
                      });
                   } else {
                      resolve();
                   }
                });
             },
             function() {
                return Promise(function(resolve, reject, notify) {
                   if (foregroundPicture) {
                      CanvasService.setCanvasAlpha(canvasModel, 1);
                      CanvasService.drawPictureToCanvas(canvasModel,
                         foregroundPicture, 
                         foregroundPictureRect[0], foregroundPictureRect[1],
                         foregroundPictureRect[2], foregroundPictureRect[3])
                      .then(function() {
                         resolve();
                      })
                      .catch(function(error) {
                         reject(error);
                      });
                   } else {
                      resolve();
                   }
                });
             },
             function() {
                return Promise(function(resolve, reject, notify) {
                   if (youtubeModel) {
                      // Draw the youtube logo in the bottom
                      // right corner.
                     
                      var youtubePicture = new PictureModel({
                         url: "/images/youtube_logo.png"
                      });

                      CanvasService.setCanvasAlpha(canvasModel, 1);
                      CanvasService.drawPictureToCanvas(canvasModel, youtubePicture,
                         canvasModel.width - youtubeLogoWidth,
                         canvasModel.height - youtubeLogoHeight,
                         youtubeLogoWidth, youtubeLogoHeight)
                      .then(function() {
                         resolve();
                      })
                      .catch(function(error) {
                         reject(error);
                      });
                   } else {
                      resolve();
                   }  
                });              
             }
         ];

         SerialPromise(serialFnArray)
         .then(function() {
            PictureService.getPictureFromFileModel(FileModel.fromDataUrl(canvasModel.getDataUrl()))
            .then(function(picture) {
                resolve(picture);
            })   
            .catch(function(error) {
                reject(error);
            })
         })
      });
   }

   return QuestionPreviewPictureService;
}]);

module.exports = name;