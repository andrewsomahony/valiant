'use strict';

var registerService = require('services/register');

var name = 'services.set_builder';

registerService('factory', name, [
function() {
   function SetBuilderService() {

   }

   SetBuilderService.getSetTypesArray = function() {
      return ["Swim", "Kick"];
   }

   SetBuilderService.getSetStrokeModificationsArray = function() {
      return ["Scull", "Fists", "Drill", "Pull"];
   }

   SetBuilderService.getSetStrokesArray = function() {
      return ["Butterfly",
              "Backstroke", 
              "Breaststroke", 
              "Freestyle",
              "IM",
              "Choice"];
   }

   SetBuilderService.formatNotesString = function(notes) {
      if (!notes) {
         return "";
      } else {
         return "[" + notes + "]";
      }
   }

   SetBuilderService.formatQuantityString = function(quantity) {
      if (!quantity) {
         return "0x";
      } else {
         return "" + quantity + "x";
      }
   }

   SetBuilderService.formatSetTotalString = function(total) {
      if (!total) {
         return "0";
      } else {
         return "" + total;
      }
   }

   return SetBuilderService;
}
]);

module.exports = name;