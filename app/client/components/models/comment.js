'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var utils = require('utils');

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
               type: "",
               parent: null,
               creator: {__alias__: "models.user"} 
            });
         },
         serverMappings: function() {
            return this.staticMerge(this.callSuper(), {
               "creator": "_creator",
               "parent": "_parent"
            });
         },
         localFields: function() {
            return this.staticMerge(this.callSuper(), [
               "creator", "parent", "type"
            ]);
         },
         manualFields: function() {
            return this.staticMerge(this.callSuper(), [
               "parent"
            ]);
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();

         this.initializeManualField("parent");
      }
   });
}]);

module.exports = name;