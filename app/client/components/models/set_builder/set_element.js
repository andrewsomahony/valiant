'use strict'

var registerModel = require('./register');
var classy = require('classy');

var name = 'models.set_element';

registerModel(name, [require('models/base'),
                     require('models/set_builder/speed_time'),
function(BaseModel, SpeedTimeModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               notes: "",
               quantity: 0,
               distance: "",
               type: "",
               stroke: "",
               stroke_modification: "",
               intervals: [{__model__: SpeedTimeModel}],
               rests: [{__model__: SpeedTimeModel}]
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper();
      }
   });
}]);

module.exports = name;