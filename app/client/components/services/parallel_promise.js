'use strict';

var m = require('./module')
var utils = require('utils')

var name = 'parallelPromiseService';

var progressClass = require('models/progress');

m.factory(name, [require('services/promise'),
                 require('services/progress'),
                 require('models/progress'),
                 '$q',
function(promise, progress, ProgressModel, $q) {
   function parallelPromiseService(promiseFnArray, keepAsArray, supportNotify) {
      keepAsArray = false === utils.isUndefinedOrNull(keepAsArray) ? keepAsArray : false;
      supportNotify = false === utils.isUndefinedOrNull(supportNotify) ? supportNotify : false;

      var progressInfoArray = []

      if (true === supportNotify) {
         promiseFnArray.forEach(function(promiseFn) {
            var progressObject = promiseFn(true);

            if (false === utils.objectIsClassy(progressObject, ProgressModel)) {
               progressInfoArray.push(progress(0, 1));
            } else {
               progressInfoArray.push(progressObject)
            }
         })
      }
      else {
         progressInfoArray = new Array(promiseFnArray.length);

         for (var i = 0; i < promiseFnArray.length; i++) {
            progressInfoArray[i] = progress(0, 1);
         }
      }

      return promise(function(resolve, reject, notify) {
         $q.all(promiseFnArray.map(function(promiseFn, index) {
            return promiseFn(false)
            .then(function(data) {

               progressInfoArray[index].complete();
               notify(progress.sumArray(progressInfoArray));

               return data;

            }, null, function(progressData) {
               progressInfoArray[index] = progressData;
               notify(progress.sumArray(progressInfoArray))
            })
            .catch(function(error) {
               reject(error);
            })
         }))
         .then(function(results) {
            if (false === keepAsArray)
            {
               var ret = {}
               results.forEach(function(result) {
                  ret = utils.extend(true, ret, result);
               })
               resolve(ret)
            }
            else
            {
               resolve(results)
            }
         })
         .catch(function(error) {
            reject(error)
         })
      })
   }

   parallelPromiseService.withNotify = function(promiseFnArray, keepAsArray) {
      return this(promiseFnArray, keepAsArray, true)
   }

   parallelPromiseService.getProgressSum = function(promiseFnArray) {
      var arr = [];

      promiseFnArray.forEach(function(fn) {
         var progressObject = fn(true);

         if (false === utils.objectIsClassy(progressObject, ProgressModel)) {
            arr.push(progress(0, 1));
            //throw new Error("parallelPromiseService with supportNotify=true must have ALL functions able to return a progress object!");
         } else {
            arr.push(progressObject)
         }
      }) 

      return progress.sumArray(arr)
   }

   return parallelPromiseService;
}])

module.exports = name;