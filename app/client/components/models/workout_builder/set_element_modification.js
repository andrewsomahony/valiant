'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.set_element_modification';

registerModel(name, [require('models/base'),
function(BaseModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               name: ""
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper();
      }
   });
}]);

module.exports = name;