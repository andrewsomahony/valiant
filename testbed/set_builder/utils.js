

/*
    // CommonJS module
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Chance;
        }
        exports.Chance = Chance;
    }

    // Register as an anonymous AMD module
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return Chance;
        });
    }

    // if there is a importsScrips object define chance for worker
    if (typeof importScripts !== 'undefined') {
        chance = new Chance();
    }

    // If there is a window object, that at least has a document property,
    // instantiate and define chance on the window
    if (typeof window === "object" && typeof window.document === "object") {
        window.Chance = Chance;
        window.chance = new Chance();
    }
*/

// Replacement for common jQuery functions to reduce our reliance on it
// Should Work on IE10+

(function() {

   var Utils = {
      objectIsClassy: function(object, classObject) {
        if (!object) {
           return false;
        } else {
           classObject = classObject || null;
        
           return 'object' === typeof object 
                && false === this.isUndefinedOrNull(object.$ownClass)
                && (null === classObject || true === this.objectIsTypeOfClass(object, classObject))
        } 
     },
      
      objectIsTypeOfClass: function(object, classObject) {
         if (!object) {
             return false;
         } else {
            return object.$ownClass === classObject;
         }
      },

      isArray: function(object) {
         return Array.isArray(object)
      },
      
      objectHasFunction: function(object, functionName) {
         if (object[functionName] &&
             'function' === typeof object[functionName]) {
            return true;
         } else {
            return false;
         }
      },

      objectHasKeys: function(object) {
         return 0 !== Object.keys(object).length
      },

      getUndefined: function() {
         return (function() {})()
      },

      isUndefinedOrNull: function(object) {
         return undefined === object || null === object || 'undefined' === typeof object
      },
      
      isString: function(object) {
         return 'string' === typeof object;
      },

      isPlainObject: function(object) {
         if (!object || 'object' !== typeof object) {
            return false;
         }

         try {
            if (object.constructor &&
                false === object.hasOwnProperty("constructor") &&
                false === object.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
               return false;
            }
         } 
         catch(e) {
            return false;
         }

         var key;
         for (key in object) {}

         return 'undefined' === typeof key || true === object.hasOwnProperty(key)
      },

      findInArray: function(array, sentinelFn) {
         var returnValue;
         array.every(function(element) {
            if (true === sentinelFn(element)) {
               returnValue = element;
               return false;
            }
            else {
               return true;
            }
         })
         return returnValue
      },

      findAllInArray: function(array, sentinelFn) {
         var returnValue = []

         array.forEach(function(element) {
            if (true === sentinelFn(element)) {
               returnValue.push(element)
            }
         });

         return returnValue
      },

      indexOf: function(array, sentinelFn) {
         var returnValue = null;

         array.every(function(element, index) {
            if (true === sentinelFn(element)) {
               returnValue = index;
               return false;
            } else {
               return true;
            }
         })

         return returnValue;
      },

      inlineDeleteFromArray: function(array, sentinelFn) {
         var index = this.indexOf(array, sentinelFn)

         if (false === this.isUndefinedOrNull(index)) {
            array.splice(index, 1)
         }
      },

      objectToArray: function(obj) {
         if (false === this.isPlainObject(obj)) {
            throw new Error("utils.objectToArray: Obj is not a plain object!")
         }

         return this.map(Object.keys(obj), function (key) {
            return obj[key]
         });
      },

      runInArray: function(array, sentinelFn, fn) {
         sentinelFn = sentinelFn || function(e) {return true;}
         array.forEach(function(element) {
            if (true === sentinelFn(element)) {
               fn.call(element)
            }
         })
      },

      clone: function(obj) {
         if (true === this.isPlainObject(obj))
         {
            return this.extend(true, {}, obj);
         }
         else if (true === this.isArray(obj))
         {
            return this.extend(true, [], obj);
         }
         else
         {
            // Always makes a new copy if not an Object or Array type
            // As Javascript passes only object or array arguments by reference
            return obj;
         }
      },
      
      forEachKey: function(array, sentinelFn) {
        Object.keys(array).forEach(function(k) {
            sentinelFn(k);
        });
      },
      
      hasKey: function(array, keyName) {
         var returnValue = false;
          
         this.forEachKey(array, function(key) {
             if (key === keyName) {
                returnValue = true;
             }
         });
         
         return returnValue;
      },

      // Sentinel returns true if we want to KEEP it
      grep: function(array, sentinelFn) {
         var newArray = [];

         array.forEach(function(element) {
            if (true === sentinelFn(element)) {
               newArray.push(element);
            }
         })

         return newArray;
      },

      map: function(array, sentinelFn, thisPointer) {
         var newArray = [];
         thisPointer = thisPointer || this;

         var self = this;

         array.forEach(function(element, index) {
            var obj = sentinelFn.call(thisPointer, element, index);

            if (false === self.isUndefinedOrNull(obj)) {
               newArray.push(obj)
            }
         })

         return newArray
      },

      merge: function(array) {
         for (var i = 1; i < arguments.length; i++) {
            var newArray = arguments[i];

            array = array.concat(newArray);
         }

         return array;
      },

      extend: function(isDeep, array) {
         for (var i = 2; i < arguments.length; i++) {
            var object = arguments[i];

            if (!object) {
               continue;
            }

            for (var key in object) {
               if (true === object.hasOwnProperty(key)) {
                  var source = array[key];
                  var isArray = false;

                  if (array === source) {
                     continue;
                  }

                  if (true === isDeep &&
                      (true === this.isPlainObject(object[key]) || (isArray = this.isArray(object[key])))) {
                     var newObject;

                     if (true === isArray) {
                        newObject = source && true === this.isArray(source) ? source : []
                     }
                     else {
                        newObject = source && true === this.isPlainObject(source) ? source : {}
                     }

                     array[key] = this.extend(isDeep, newObject, object[key]);
                  }
                  else {
                     array[key] = object[key]
                  }
               }
            }
         }

         return array;
      },

      toJson: function(obj) {
         return JSON.stringify(obj);
      },

      fromJson: function(json) {
         return JSON.parse(json)
      },

      round: function(n, places) {
         if (true === this.isUndefinedOrNull(places)) {
             places = 0;
         }
         
         return +n.toFixed(places)
      },

      padWithLeadingZeroes: function(number, numberOfLeadingZeroes) {
         var returnString = '' + number;
         while (returnString.length < length) {
            returnString = '0' + returnString;
         }
         return returnString;
      },
      
      stringToBoolean: function(string) {
         if (!string) {
             return null;
         } else {
            if ('string' !== typeof string) {
               throw new Error("utils.stringToBoolean: parameter is not a string!");
            }
            return !!this.fromJson(string.toLowerCase());
         }
      },
      
      sliceStringByRegexMatches: function(string, startRegexMatch, endRegexMatch) {
          var startIndex = 0;
          var endIndex = string.length - 1;
          
          if (startRegexMatch) {
              startIndex = startRegexMatch.index;
          }
          
          if (endRegexMatch) {
              if (endRegexMatch.index > startIndex) {
                 endIndex = endRegexMatch.index;
              }
          }
          
          return string.slice(startIndex, endIndex);
      },
      
      parseTimeStringToSeconds: function(timeString) {
         var timeMatch = timeString.match(/(\d{1,}):(\d{1,2}):(\d{1,2})(\.(\d{1,}))?/);
         
         var time = 0;
         if (timeMatch) {
            time += parseInt(timeMatch[1]) * 3600;
            time += parseInt(timeMatch[2]) * 60;
            time += parseInt(timeMatch[3]);
            time += parseFloat(timeMatch[5]);
         }
         
         return time;
      }
   }
  
   if ('undefined' !== typeof module && module.exports) {
      module.exports = Utils;
   } else {
      window['utils'] = Utils;
   }

})()

/*'undefined' !== typeof exports ? ('undefined' !== typeof module ? module.exports : exports) : window*/

