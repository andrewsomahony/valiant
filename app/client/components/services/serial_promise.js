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
      supportNotify = false === utils.isUndefinedOrNull(supportNotify) ? supportNotify : false;

      removeFinalKeyIfAlone = false === utils.isUndefinedOrNull(removeFinalKeyIfAlone) ? removeFinalKeyIfAlone : false;

      var allData = {};
      var progressInfoArray = [];

      if (true === supportNotify) {
         promiseFnArray.forEach(function(fn) {
            var progressObject = fn(null, -1, true)

            if (false === utils.objectIsClassy(progressObject, ProgressModel)) {
               progressInfoArray.push(progress(0, 1));
               //throw new Error("serialPromiseService with supportNotify=true must have ALL functions able to return a progress object!");
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

      function serialFn(index, parentNotify) {
         index = index || 0
         parentNotify = parentNotify || null

         return promise(function(resolve, reject, notify) {
            if (index === promiseFnArray.length) {
               resolve(allData)
            }
            else {
               var fn = promiseFnArray[index];  

               fn(allData, index, false)
               .then(function(promiseData) {
                  // Notify completion first
                  progressInfoArray[index].complete()

                  if (parentNotify) {
                     parentNotify(progress.sumArray(progressInfoArray, 
                        progressInfoArray[index].message));
                  }
                  else {
                     notify(progress.sumArray(progressInfoArray,
                        progressInfoArray[index].message));
                  }

                  promiseData = utils.isUndefinedOrNull(promiseData) ? {}
                                    : promiseData;

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

/*
                           var newData = {};

                           Object.keys(d).forEach(function(k) {
                              newData[k] = d[k]
                           })*/
                           // This could be a boolean or int...
                           // should work the same.
                           finalData = d;
   

                           //finalData = newData;
                        }

                        resolve(finalData);
                     }
                     else {
                        resolve(finalData)
                     }
                  })
                  .catch(function(error) {
                     reject(error)
                  })
               }, null, function(notifyData) {

                  if (true === supportNotify &&
                      notifyData && 
                      true === utils.objectIsClassy(notifyData, ProgressModel)) {
                     
                     if (!notifyData.message) {
                         notifyData.message = progressInfoArray[index].message;
                     }
                     progressInfoArray[index] = notifyData;
                  }

                  if (parentNotify) {
                     parentNotify(progress.sumArray(progressInfoArray, progressInfoArray[index].message));
                  }
                  else {
                     notify(progress.sumArray(progressInfoArray, progressInfoArray[index].message));
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
            arr.push(progress(0, 1));
            //throw new Error("serialPromiseService with supportNotify=true must have ALL functions able to return a progress object!");
         } else {
            arr.push(progressObject)
         }
      }) 

      return progress.sumArray(arr)
   }

   return serialPromiseService;   
}])

module.exports = name;