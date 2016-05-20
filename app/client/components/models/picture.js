'use strict';

var registerModel = require('./register');
var classy = require('classy');

var name = 'pictureModel';

registerModel(name, [require('models/base'),
function(BaseModel) {
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