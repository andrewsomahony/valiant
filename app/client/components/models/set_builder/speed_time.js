'use strict'

var registerModel = require('./register');
var classy = require('classy');

var name = 'models.speed_time';

registerModel(name, [require('models/base'),
                     require('models/time'),
function(BaseModel, TimeModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               name: "",
               time: {__model__: TimeModel}
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper();
      }
   });
}]);

module.exports = name;