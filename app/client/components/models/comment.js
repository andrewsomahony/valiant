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
               creator: {__alias__: "models.user"} 
            });
         },
         serverMappings: function() {
            return this.staticMerge(this.callSuper(), {
               "creator": "_creator"
            });
         },
         localFields: function() {
            return this.staticMerge(this.callSuper(), [
               "creator"
            ]);
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      }
   });
}]);

module.exports = name;