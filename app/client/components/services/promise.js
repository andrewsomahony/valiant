'use strict';

var registerService = require('./register');

var name = 'promiseService'

registerService('factory', name, ['$q',
function($q) {
   function promiseService(fn) {
      var deferred = $q.defer();

      fn(deferred.resolve, deferred.reject, deferred.notify);

      return deferred.promise;
   }

   return promiseService;
}])

module.exports = name;