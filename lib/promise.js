var Q = require('q');

function Promise(fn) {
   var deferred = Q.defer();
   
   fn(deferred.resolve, deferred.reject, deferred.notify);
   
   return deferred.promise;
}

module.exports = Promise;