'use strict';

var registerService = require('./register');

var name = 'services.promise';

registerService('factory', name, ['$q',
function($q) {
   function promiseService(fn) {
      var deferred = $q.defer();

      fn.call(this, 
              deferred.resolve, 
              deferred.reject, 
              deferred.notify);

      return deferred.promise;
   }

   return promiseService;
}])

module.exports = name;