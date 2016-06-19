'use strict'

var registerModel = require('./register');
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
               sets: [{__model__: SetModel}]
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper();
      }
   });
}]);

module.exports = name;