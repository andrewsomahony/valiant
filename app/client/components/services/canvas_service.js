'use strict';

var registerService = require('services/register');

var name = 'services.canvas';

registerService('factory', name, [require('services/picture_service'),
                                  require('services/promise'),
function(PictureService, Promise) {
   function CanvasService() {

   }

   function getCanvasModelContext(canvasModel) {
      if (!canvasModel) {
         throw new Error("getCanvasModelContext: Invalid canvasModel!");
      }
      if (!canvasModel.canvas_model) {
         throw new Error("getCanvasModelContext: Invalid canvas_model!");
      }
      return canvasModel.canvas_model.getContext("2d");
   }

   CanvasService.setCanvasAlpha = function(canvasModel, alpha) {
      var context = getCanvasModelContext(canvasModel);
      
      context.globalAlpha = alpha;
   }

   CanvasService.drawClippedImageToCanvas = function(canvasModel, domImage,
      imageX, imageY, imageWidth, imageHeight,
      x, y, width, height) {
      var context = getCanvasModelContext(canvasModel);

      context.drawImage(domImage, imageX, imageY, imageWidth,
         imageHeight, x, y, width, height);
   }

   CanvasService.drawImageToCanvas = function(canvasModel, domImage, x, y, width, height) {
      CanvasService.drawClippedImageToCanvas(canvasModel, 0, 0, domImage.width, domImage.height,
            x, y, width, height);
   }

   CanvasService.drawClippedPictureToCanvas = function(canvasModel, pictureModel,
         pictureX, pictureY, pictureWidth, pictureHeight,
         x, y, width, height) {

      return Promise(function(resolve, reject, notify) {
         PictureService.getDOMImageFromPicture(pictureModel)
         .then(function(domImage) {
            CanvasService.drawClippedImageToCanvas(canvasModel,
            domImage, pictureX, pictureY, pictureWidth, pictureHeight,
            x, y, width, height);
            resolve();
         })
         .catch(function(error) {
            reject(error);
         })
      });
   }

   CanvasService.drawPictureToCanvas = function(canvasModel, picture,
         x, y, width, height) {

      return Promise(function(resolve, reject, notify) {
         PictureService.getDOMImageFromPicture(pictureModel)
         .then(function(domImage) {
            CanvasService.drawImageToCanvas(canvasModel,
            domImage, x, y, width, height);
            resolve();
         })
         .catch(function(error) {
            reject(error);
         })
      });

   }

   return CanvasService;
}
])

module.exports = name;