'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.picture';

registerModel(name, [require('models/base'),
function(BaseModel) {
   console.log("REGISTERING PICTURE");
   return classy.define({
      extend: BaseModel,
      alias: name,
      
      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               url: "",
               description: "",
               metadata: {}
            });
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      }
   });
}])

module.exports = name;