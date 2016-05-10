'use strict'

var registerModel = require('./register');
var classy = require('classy');

var baseModel = require('models/base');

var name = 'progressModel'

registerModel(name, [require('./base'),
function(baseModel) {
   return classy.define({
      extend: baseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               current: 0,
               total: 0,
               message: ""
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper()
      },

      complete: function() {
         this.current = this.total;
      },
      
      percentage: function() {
         return this.current / this.total;
      }
   })
}])

module.exports = name;