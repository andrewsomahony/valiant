'use strict';

var m = require('./module')

var name = 'progressService'

m.factory(name, [require('../models/progress'),
function(progressModel) {
   function progressService(current, total) {
      return new progressModel({current: current, total: total})
   }

   progressService.notify = function(notify, current, total) {
      notify(this(current, total));
   }

   progressService.sumArray = function(arr) {
      var current = 0;
      var total = 0;

      arr.forEach(function(progressModel) {
         current += progressModel.current;
         total += progressModel.total;
      })

      return this(current, total)
   }

   return progressService;
}])

module.exports = name;