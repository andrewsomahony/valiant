'use strict';

var registerModel = require('models/register');

var classy = require('classy');

var name = 'models.canvas';

registerModel(name, [require('models/base'),
function(BaseModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               canvas_object: null,
               canvas_context: null,
               width: 0,
               height: 0
            })
         },

         localFields: function() {
            return this.staticMerge(this.callSuper(), [
               'canvas_object'
            ]);
         }
      },

      init: function(config) {
         this.callSuper();

         this.canvas_object = document.createElement("canvas");
         this.canvas_context = this.canvas_object.getContext('2d');
         this.canvas_object.width = this.width;
         this.canvas_object.height = this.height;
      },

      getDataUrl: function() {
         return this.canvas_object.toDataURL("image/png");
      }
   })
}])

module.exports = name;