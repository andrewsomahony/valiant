'use strict'

var registerModel = require('models/register');
var classy = require('classy');

var utils = require('utils');

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
      
      toString: function(withCode) {
          if (true === utils.isUndefinedOrNull(withCode)) {
             withCode = true;
          }
          return this.text + (withCode ? " (" + this.code + ")" : "");
      }
   })
}])

module.exports = name;