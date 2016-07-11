'use strict'

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.set_element';

registerModel(name, [require('models/base'),
                     require('models/workout_builder/speed_time'),
                     require('models/workout_builder/set_element_modification'),
function(BaseModel, SpeedTimeModel, SetElementModificationModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               notes: "",
               quantity: "",
               distance: "",
               stroke: "",
               modifications: [{__model__: SetElementModificationModel}],
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