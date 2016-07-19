'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.comment';

registerModel(name, [require('models/base'),
function(BaseModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,
      
      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               text: "",
               // Also accepts a plain ID
               creator: {__alias__: "models.user"} 
            });
         },
         serverMappings: function() {
            return this.staticMerge(this.callSuper(), {
               "creator": "_creator"
            });
         }
      },

      // So, as comments are PATCHED in with whatever
      // object they're a part of (question, etc), we don't
      // want to ever send the populated creator data, only an ID.

      toObject: function(isForServer) {
         console.log("IS FOR SERVER", isForServer);
         var returnValue = this.callSuper(isForServer);

         if (isForServer) {
            if (utils.isPlainObject(returnValue['_creator'])) {
               delete returnValue['_creator'];
            }
         }
         console.log("RETURN", returnValue);
         return returnValue;
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      }
   });
}]);

module.exports = name;