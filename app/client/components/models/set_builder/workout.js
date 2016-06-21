'use strict'

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.workout';

registerModel(name, [require('models/base'),
                     require('models/set_builder/set'),
function(BaseModel, SetModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               name: "",
               sets: [{__model__: SetModel}]
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper();
      },

      getTotalDistance: function() {
         var totalDistance = 0;
         this.sets.forEach(function(set) {
            totalDistance += set.getTotalDistance();
         });

         return totalDistance;
      }
   });
}]);

module.exports = name;