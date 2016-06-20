'use strict'

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.set';

registerModel(name, [require('models/base'),
                     require('models/set_builder/set_element'),
function(BaseModel, SetElementModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               notes: "",
               quantity: "",
               elements: [{__model__: SetElementModel}]
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper();
      },

      getTotalDistance: function() {
         var totalDistance = 0;
         this.elements.forEach(function(element) {
            totalDistance += parseInt(element.quantity || 0) * parseInt(element.distance || 0);
         });

         totalDistance *= parseInt(this.quantity || 0);

         return totalDistance;
      }
   });
}]);

module.exports = name;