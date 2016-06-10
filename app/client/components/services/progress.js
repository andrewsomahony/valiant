'use strict';

var m = require('./module')

var name = 'progressService'

m.factory(name, [require('../models/progress'),
function(progressModel) {
   function progressService(current, total, message) {
      if (current > total) {
         current = total;
      }
      return new progressModel({current: current, total: total, message: message})
   }

   progressService.notify = function(notify, current, total, message) {
      notify(this(current, total, message));
   }

   progressService.sumArray = function(arr, message) {
      var current = 0;
      var total = 0;

      arr.forEach(function(progressModel) {
         current += progressModel.current;
         total += progressModel.total;
      })

      return this(current, total, message)
   }

   return progressService;
}])

module.exports = name;