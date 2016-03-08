'use strict';

var m = require('./module')

var name = 'promiseService'

m.factory(name, ['$q',
function($q) {
   function promiseService(fn) {
      var deferred = $q.defer();

      fn(deferred.resolve, deferred.reject, deferred.notify);

      return deferred.promise;
   }

   return promiseService;
}])

module.exports = name;