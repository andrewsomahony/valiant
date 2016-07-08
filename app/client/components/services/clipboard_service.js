'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.clipboard';

registerService('factory', name, [
function() {
   function ClipboardService() {

   }

   var currentModel = null;

   ClipboardService.copy = function(model) {
      currentModel = model;
   }

   ClipboardService.canPaste = function(Class) {
      return utils.objectIsClassy(currentModel, Class);
   }

   ClipboardService.paste = function() {
      // Should it remove it from the clipboard?
      return currentModel;
   }

   return ClipboardService;
}
]);

module.exports = name;
