'use strict';

var registerService = require('services/register');

var name = 'services.canvas';

registerService('factory', name, [require('services/picture_service'),
function(PictureService) {
   function CanvasService() {

   }

   function getCanvasModelContext(canvasModel) {
      return canvasModel.canvas_model.getContext("2d");
   }

   CanvasService.setCanvasAlpha = function(canvasModel) {

   }

   CanvasService.drawPictureToCanvas = function(canvasModel, pictureModel) {
      
   }

   return CanvasService;
}
])

module.exports = name;