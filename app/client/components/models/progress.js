'use strict'

var m = require('./module')
var classy = require('classy')

var name = 'progressModel'

m.factory(name, [require('./base'),
function(baseModel) {
   return classy.define({
      extend: baseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               current: 0,
               total: 0
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper()
      },

      complete: function() {
         this.current = this.total;
      }
   })
}])

module.exports = name;