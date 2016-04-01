'use strict'

var registerModel = require('models/register');
var classy = require('classy')

var name = 'errorModel'

registerModel(name, [require('./base'),
function(baseModel) {
   return classy.define({
      extend: baseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               text: "",
               code: 0
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper();
      },
      
      toString: function() {
          return this.text + " (" + this.code + ")";
      }
   })
}])

module.exports = name;