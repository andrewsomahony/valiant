//Commonly used functions to avoid jQuery

(function() {

   var Utils = {

      isClassy: function(object) {
         return 'object' === typeof object && 'undefined' !== typeof object.$ownClass;
      },

      isArray: function(object) {
         return Array.isArray(object)
      },

      isPlainObject: function(object) {
         if (!object || 'object' !== typeof object)
         {
            return false;
         }

         try 
         {
            if (object.constructor &&
                false === object.hasOwnProperty("constructor") &&
                false === object.constructor.prototype.hasOwnProperty("isPrototypeOf"))
            {
               return false;
            }
         } 
         catch(e) 
         {
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
            } else {
               return true;
            }
         })
         return returnValue
      },

      objectToArray: function(obj) {
         return Object.keys(obj).map(function (key) {
            return obj[key]
         });
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
            return obj;
         }
      },

      extend: function(isDeep, array) {
         for (var i = 2; i < arguments.length; i++)
         {
            var object = arguments[i];

            if (!object)
            {
               continue;
            }

            for (var key in object)
            {
               if (true === object.hasOwnProperty(key))
               {
                  var source = array[key];
                  var isArray = false;

                  if (array === source)
                  {
                     continue;
                  }

                  if (true === isDeep &&
                      (true === this.isPlainObject(object[key]) || (isArray = this.isArray(object[key]))))
                  {
                     var newObject;

                     if (true === isArray)
                     {
                        newObject = source && true === this.isArray(source) ? source : []
                     }
                     else
                     {
                        newObject = source && true === this.isPlainObject(source) ? source : {}
                     }

                     array[key] = this.extend(isDeep, newObject, object[key]);
                  }
                  else
                  {
                     array[key] = object[key]
                  }
               }
            }
         }

         return array;
      }
   }

   module.exports = Utils;

})();

