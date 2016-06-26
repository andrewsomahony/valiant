'use strict'

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.workout';

registerModel(name, [require('models/base'),
                     require('models/workout_builder/set'),
                     require('models/user'),
function(BaseModel, SetModel, UserModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               name: "",
               sets: [{__model__: SetModel}],
               creator: {__model__: UserModel}
            })
         },
         localFields: function() {
            return ['creator']
         },
         serverMappings: function() {
            return {
               "creator": "_creator"
            }
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