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
      if (false === utils.objectIsClassy(model)) {
         throw new Error("ClipboardService.copy: Model to be copied is not a classy object!");
      }
      currentModel = new model.$ownClass();
      currentModel.fromModel(model);

      // Sometimes we want to know which model we have
      // on the clipboard.  Therefore, we compare by local_id,
      // so we do the same thing here.
      currentModel.setInternalVariable('local_id',
         model.getInternalVariable('local_id'));
   }

   ClipboardService.hasModel = function(model) {
      if (!currentModel) {
         return false;
      } else {
         return currentModel.isEqualToModel(model);
      }
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
