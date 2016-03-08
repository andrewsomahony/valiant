'use strict'

var m = require('./module')
var classy = require('classy')

var name = 'errorModel'

m.factory(name, [require('./base'),
function(baseModel) {
   return classy.define({
      extend: baseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               error: "",
               code: 0
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper();
      }
   })
}])

module.exports = name;