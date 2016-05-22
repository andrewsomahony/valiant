'use strict'

var m = require('./module')
var classy = require('classy')

//Our own written library with common jQuery functions
var utils = require('utils');

var patchService = require('rfc6902');

var name = 'baseModel'

m.factory(name, [require('../services/id'),
                 require('../services/promise'),
function(id, promise) {

   function ModelToObject(model, isForServer) {
      if (true === utils.objectIsClassy(model)) {
         var ret = {}

         var fields = model.$ownClass.filterToSerializationFields()

         if (true === isForServer) {
            fields = model.$ownClass.filterToServerFields(fields)
         }

         Object.keys(fields).forEach(function(key) {
            if (true === isForServer && 
                ('id' === key)) {
               // If our "id" is empty, we don't
               // want to send it.
               
               if (!model[key]) {
                   return true;
               }
            }
            ret[model.$ownClass.mapKey(key, isForServer)] = ModelToObject(model.$ownClass.mapValue(model[key], fields[key], isForServer), isForServer);//!utils.isUndefinedOrNull(model[key]) ? model[key] : fields[key], isForServer)         
         });

         return ret;
      } else if (true === utils.isArray(model)) {
         var ret = []

         model.forEach(function(element) {
            ret.push(ModelToObject(element, isForServer))
         })

         return ret;
      } else if (true === utils.isPlainObject(model)) {
         var ret = {};

         Object.keys(model).forEach(function(key) {
            if (true === model.hasOwnProperty(key)) {
               ret[key] = ModelToObject(model[key], isForServer)
            }
         })

         return ret;
      } else {
         return utils.clone(model)
      } 
   }

   return classy.define({
      alias: name,

      statics: {
         classyAliasKey: "__alias__",
         classyModelKey: "__model__", // Unused
         
         getClassyField: function(field) {
            var classAlias = null;
            var objectToCheckForClass = null;
            
            if (true === utils.isArray(field)) {
                if (field.length &&
                    true === utils.isPlainObject(field[0])) {
                    objectToCheckForClass = field[0];    
                }       
            } else if (true === utils.isPlainObject(field)) {
                objectToCheckForClass = field;
            }
            
            if (objectToCheckForClass) {
                if (utils.hasKey(objectToCheckForClass, this.classyAliasKey)) {
                    classAlias = objectToCheckForClass[this.classyAliasKey];
                }
            }
            
            return classAlias;         
         },
         
        mapValue: function(value, defaultValue, isServer) {
            isServer = utils.isUndefinedOrNull(isServer) ? false : isServer;
            var classAlias = this.getClassyField(defaultValue);
            var isUndefined = utils.isUndefinedOrNull(value);

            if (classAlias) {
                var Class = classy.getClass(classAlias);
                if (true === utils.isArray(value)) {
                    var newArray = [];
                    
                    if (!isUndefined) {
                       value.forEach(function(element) {
                           newArray.push(new Class(element, isServer)); 
                       });
                    }
                    
                    return newArray;
                } else {
                    return isUndefined ? new Class() : 
                        (utils.objectIsClassy(value, Class) ? value.clone() : new Class(value, isServer));
                }
            } else {
               return isUndefined ? defaultValue : value;
            }         
         },
         
         allocateChildArrayOfClasses: function(variableName, length, isServer) {
             var defaultValue = this.fields()[variableName];
             
             if (!defaultValue) {
                throw new Error("allocateChildArrayOfClasses: Missing field ", variableName);
             } else {
                // Make a dummy array filled with empty
                // objects, so our mapValue method
                // will properly call the class constructors
                // for whatever variable we want to allocate
                var arr = new Array(length);
                
                for (var i = 0; i < length; i++) {
                   arr[i] = {};
                }
                
                return this.mapValue(arr, defaultValue, isServer);
             }
         },
          
         // Utility function so each class doesn't need to require utils
         staticMerge: function(superFields, fields) {
            return utils.extend(true, superFields, fields)
         },
         fields: function() {
            return {
               id: "",
               local_id: "",
               created_at: "",
               updated_at: ""
            }
         },
         // Fields NOT to send to the server
         localFields: function() {
            return ['local_id'];
         },
         // Fields NOT serialized to/from JSON
         temporaryFields: function() {
            return ['local_id']
         },
         // Fields that are in the JSON, but can't be initialized automatically
         manualFields: function() {
            return ['local_id'];
         },
         // key is the key we have
         // value is the value the server wants
         serverMappings: function() {
            return {
                "id": "_id"
            }
         },

         validEvents: function() {
            return []
         },

         filterToServerFields: function(fields) {
            fields = fields || this.fields()

            this.localFields().forEach(function(localField) {
               if (true === fields.hasOwnProperty(localField)) {
                  delete fields[localField]
               }
            })

            return fields;
         },

         filterToSerializationFields: function(fields) {
            fields = fields || this.fields()

            this.temporaryFields().forEach(function(temporaryField) {
               if (true === fields.hasOwnProperty(temporaryField)) {
                  delete fields[temporaryField]
               }
            })

            return fields;
         },

         mapKey: function(key, isForServer) {
            isForServer = utils.isUndefinedOrNull(isForServer) ? false : isForServer;
             
            return true === isForServer && 
                   true === this.serverMappings().hasOwnProperty(key) ? this.serverMappings()[key] : key;
         },

         isManualKey: function(key) {
            if (utils.findInArray(this.manualFields(), function(f) {
               return f === key
            })) {
               return true;
            } else {
               return false;
            }
         },

         isValidEvent: function(e) {
            return utils.findInArray(this.validEvents(), function(eventName) {
               return e === eventName
            })
         }
      },

      getClass: function() {
         return this.$ownClass;
      },

      init: function(config, isFromServer) {
         config = config || {};
         isFromServer = true === utils.isUndefinedOrNull(isFromServer) ? false : isFromServer;

         var fields = this.$ownClass.fields()

         Object.keys(fields).forEach(function(key) {
            // We clone because the static properties can be empty arrays or objects,
            // and we want a fresh copy of the array or object for each new object

            // NOTE: BACKBONE AND UNDERSCORE DO NOT CLONE (BUG)

            if (true === this.$ownClass.isManualKey(key)) {
               this[key] = utils.clone(fields[key])
            } else {
               /*var classAlias = null;
               var objectToCheckForClass = null;
               
               var field = fields[key];
               if (true === utils.isArray(field)) {
                  if (field.length &&
                      true === utils.isPlainObject(field[0])) {
                     objectToCheckForClass = field[0];    
                  }       
               } else if (true === utils.isPlainObject(field)) {
                  objectToCheckForClass = field;
               }
               
               if (objectToCheckForClass) {
                  if (utils.hasKey(objectToCheckForClass, this.$ownClass.classyAliasKey)) {
                      classAlias = objectToCheckForClass[this.$ownClass.classyAliasKey];
                  }
               }*/
               
              // var classAlias = this.$ownClass.getClassyField(fields[key]);
               
               //var configVariable = config[this.$ownClass.mapKey(key, isFromServer)];
                
               this[key] = utils.clone(this.$ownClass.mapValue(config[this.$ownClass.mapKey(key, isFromServer)], fields[key], isFromServer)); 
                
                /*
               this[key] = utils.clone(!utils.isUndefinedOrNull(configVariable) ?
                     configVariable : fields[key])                
                
               if (classAlias) {
                  var isUndefined = utils.isUndefinedOrNull(configVariable);
                  var Class = classy.getClass(classAlias);
                  if (true === utils.isArray(this[key])) {
                     var newArray = [];
                     
                     if (!isUndefined) {
                        this[key].forEach(function(element) {
                            newArray.push(new Class(element, true)); 
                        });
                     }
                     this[key] = newArray;
                  } else {
                     this[key] = isUndefined ? null : new Class(this[key], true);
                  }
               }*/
            }

         }, this); 

         this['event_handlers'] = {}
         this['local_id'] = id()
      },

      bind: function(eventName, handlerFn, callbackObj) {
         callbackObj = callbackObj || void(0)

         if (false === this.$ownClass.isValidEvent(eventName)) {
            throw new Error("base.bind: Invalid event name " + eventName)
         }

         if (!this.event_handlers[eventName]) {
            this.event_handlers[eventName] = []
         }

         return this.event_handlers[eventName].push({handler: handlerFn, callback_object: callbackObj})
      },

      unbind: function(eventName, index, callbackObj) {
         callbackObj = callbackObj || void(0)

         if (false === this.$ownClass.isValidEvent(eventName)) {
            throw new Error("base.unbind: Invalid event name! " + eventName)
         }

         if (!this.event_handlers[eventName]) {
            throw new Error("base.unbind: Missing event handlers for event name! " + eventName)
         }

         if (callbackObj) {
            index = utils.findInArray(this.eventHandlers[eventName], function(handler) {
               return true === handler.callback_obj.isEqualTo(callbackObj)
            })
         }

         this.eventHandlers[eventName].splice(index, 1)
      },

      unbindAll: function(callbackObj) {

         // We know some events aren't bound, and we are only iterating
         // through valid events, so we can just catch the "not bound" error
         // and ignore it

         try {
            this.$ownClass.validEvents.forEach(function(eventName) {
               this.unbind(eventName, null, callbackObj)
            }, this)
         } catch(e) {

         }
      },

      trigger: function(eventName, params) {
         if (false === this.$ownClass.isValidEvent(eventName)) {
            throw new Error("base.trigger: Invalid event name! " + eventName)
         }

         var self = this;
         return promise(function(resolve, reject, notify) {
            var returnValue = true;

            self.event_handlers[eventName].every(function(eventHandler) {
               if (false === eventHandler.handler.call(self, params)) {
                  returnValue = false;
                  return false;
               } else {
                  return true;
               }
            }, this)

            if (false === returnValue) {
               reject();
            } else {
               resolve();
            }
         })
      },

      copy: function() {
         var obj = this.toObject();
         obj['id'] = "";

         return new this.$ownClass(obj);
      },

      clone: function() {
         return new this.$ownClass(this.toObject());
      },

      toObject: function(isForServer) {
         isForServer = utils.isUndefinedOrNull(isForServer) ? false : isForServer;
         return ModelToObject(this, isForServer);
      },
      
      createPatch: function(otherModel, isForServer) {
         if (false === utils.objectIsClassy(otherModel, this.$ownClass)) {
            throw new Error("createPatch: Objects not of same type!"); 
         } else {
            var ourObject = this.toObject(isForServer);
            var otherObject = otherModel.toObject(isForServer);
             
            return patchService.createPatch(otherObject, 
                                    ourObject);
         }
      }
   })   
}])

module.exports = name