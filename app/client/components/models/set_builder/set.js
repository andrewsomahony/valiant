'use strict'

var registerModel = require('./register');
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
               quantity: 1,
               elements: [{__model__: SetElementModel}]
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper();
      }
   });
}]);

module.exports = name;