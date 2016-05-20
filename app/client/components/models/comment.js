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
            return this.staticMerge(this.callSuper, {
               text: "",
               videos: [{__alias__: "models.video"}],
               pictures: [{__alias__: "models.picture"}]
            });
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      }
   });
}]);

module.exports = name;