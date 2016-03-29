'use strict';

var m = require('./module')
var utils = require('utils')

var name = 'serialPromiseService'

m.factory(name, [require('services/promise'),
                 require('services/progress'),
                 require('models/progress'),
function(promise, progress, ProgressModel) {
   function serialPromiseService(promiseFnArray, keysToDelete, keysToKeep, removeFinalKeyIfAlone, supportNotify) {
      keysToDelete = keysToDelete || []
      keysToKeep = keysToKeep || []
      supportNotify = supportNotify || false

      removeFinalKeyIfAlone = removeFinalKeyIfAlone || false

      var allData = {};
      var progressInfoArray = [];

      if (true === supportNotify) {
         promiseFnArray.forEach(function(fn) {

            var progressObject = fn(null, -1, true)

            if (false === utils.objectIsClassy(progressObject, ProgressModel)) {
               throw new Error("serialPromiseService with supportNotify=true must have ALL functions able to return a progress object!");
            } else {
               progressInfoArray.push(progressObject)
            }
         })
      }
      else {
         progressInfoArray = new Array(promiseFnArray.length);

         for (var i = 0; i < promiseFnArray.length; i++) {
            progressInfoArray[i] = progress(0, 0);
         }
      }

      function serialFn(index, parentNotify) {
         index = index || 0
         parentNotify = parentNotify || null

         return promise(function(resolve, reject, notify) {
            if (index === promiseFnArray.length) {
               resolve(allData)
            }
            else
            {
               var fn = promiseFnArray[index];  

               fn(allData, index, false)
               .then(function(promiseData) {
                  // Notify completion first
                  progressInfoArray[index].complete()

                  if (parentNotify) {
                     parentNotify(progress.sumArray(progressInfoArray));
                  }
                  else {
                     notify(progress.sumArray(progressInfoArray));
                  }

                  if (false === utils.isPlainObject(promiseData)) {
                     var newData = {};
                     newData[index] = promiseData;
                     promiseData = newData;
                  }

                  allData = utils.extend(true, allData, promiseData);

                  serialFn(index + 1, (parentNotify || notify))
                  .then(function(finalData) {
                     if (0 === index) {
                        if (keysToKeep.length > 0 &&
                            0 === keysToDelete.length) {
                           Object.keys(finalData).forEach(function(k) {
                              if (!utils.findInArray(keysToKeep, function(ktk) {
                                 return ktk === k;
                              })) {
                                 keysToDelete.push(k);
                              }
                           })
                        }

                        keysToDelete.forEach(function(k) {
                           delete finalData[k]
                        })

                        if (1 === Object.keys(finalData).length &&
                            true === removeFinalKeyIfAlone) {
                           var d = finalData[Object.keys(finalData)[0]];

                           var newData = {};

                           Object.keys(d).forEach(function(k) {
                              newData[k] = d[k]
                           })

                           finalData = newData;
                        }

                        resolve(finalData);
                     }
                     else
                     {
                        resolve(finalData)
                     }
                  })
                  .catch(function(error) {
                     reject(error)
                  })
               }, null, function(notifyData) {

                  if (true === supportNotify &&
                      notifyData && 
                      true === utils.objectIsClassy(notifyData)) {
                     progressInfoArray[index] = notifyData;
                  }

                  if (parentNotify) {
                     parentNotify(progress.sumArray(progressInfoArray));
                  }
                  else {
                     notify(progress.sumArray(progressInfoArray));
                  }
               }) 
               .catch(function(error) {
                  reject(error);
               }) 
            }        
         })
      }

      return serialFn();
   }

   serialPromiseService.withNotify = function(promiseFnArray, keysToDelete, keysToKeep, removeFinalKeyIfAlone) {
      return this(promiseFnArray, keysToDelete, keysToKeep, removeFinalKeyIfAlone, true)
   }

   serialPromiseService.getProgressSum = function(promiseFnArray) {
      var arr = [];

      promiseFnArray.forEach(function(fn) {
         var progressObject = fn(null, -1, true);

         if (false === utils.objectIsClassy(progressObject, ProgressModel)) {
            throw new Error("serialPromiseService with supportNotify=true must have ALL functions able to return a progress object!");
         } else {
            arr.push(progressObject)
         }
      }) 

      return progress.sumArray(arr)
   }

   return serialPromiseService;   
}])

module.exports = name;