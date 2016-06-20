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
   return SetBuilderService;
}
]);

module.exports = name;