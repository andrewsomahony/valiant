'use strict';

var registerModel = require('./register');
var classy = require('classy');

var name = 'models.video';

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
               title: "",
               metadata: {}
            });
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      },
      
      getWidth: function() {
         
      },
      
      getHeight: function() {
         
      }
   });
}])

module.exports = name;