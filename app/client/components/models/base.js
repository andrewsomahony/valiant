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
            ret[model.$ownClass.mapKey(key, isForServer)] = 
                ModelToObject(model[key], isForServer);         
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
         classyModelKey: "__model__",

         getClassyFieldClass: function(field) {
            var classObject = null;
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
                   classObject = classy.getClass(objectToCheckForClass[this.classyAliasKey]);
                } else if (utils.hasKey(objectToCheckForClass, this.classyModelKey)) {
                   classObject = objectToCheckForClass[this.classyModelKey];
                }
            }
            return classObject;
         },
         
        mapValue: function(value, defaultValue, isServer) {
            isServer = utils.isUndefinedOrNull(isServer) ? false : isServer;

            var isUndefined = utils.isUndefinedOrNull(value);

            var Class = this.getClassyFieldClass(defaultValue);

            if (Class) {
                if (true === utils.isArray(defaultValue)) {
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
                return utils.clone(isUndefined ? defaultValue : value);
            }       
         },
          
         // Utility function so each class doesn't need to require utils
         staticMerge: function(superFields, fields) {
            return utils.extend(true, superFields, fields)
         },
         fields: function() {
            return {
               id: "",
               created_at: "",
               updated_at: ""
            }
         },
         serverFields: function() {
             return [
                'id',
                'created_at',
                'updated_at'
             ];
         },
         // Fields NOT to send to the server
         localFields: function() {
            return [];
         },
         // Fields NOT serialized to/from JSON
         temporaryFields: function() {
            return [];
         },
         // Fields that are in the JSON, but can't be initialized automatically
         manualFields: function() {
            return [];
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

            utils.removeKeysFromObject(fields, this.localFields());

            return fields;
         },

         filterToSerializationFields: function(fields) {
            fields = fields || this.fields()

            utils.removeKeysFromObject(fields, this.temporaryFields());

            return fields;
         },

         mapKey: function(key, isForServer) {
            isForServer = utils.isUndefinedOrNull(isForServer) ? false : isForServer;

            if (!isForServer) {
               return key;
            } else {
               return true === this.serverMappings().hasOwnProperty(key) ? this.serverMappings()[key] : key; 
            }
            
            // !!! Why did the commented-out code work?
            /*
            return true === isForServer && 
                   true === this.serverMappings().hasOwnProperty(key) ? this.serverMappings()[key] : key;*/
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
         this.fromObject(config, isFromServer);

         // Special variables that aren't in the
         // fields array so they are never serialized
         // or anything.  Each object retains their own
         this.setInternalVariable('event_handlers', {});
         this.setInternalVariable('local_id', id());
      },

      initializeManualField: function(fieldName) {
         if (this.type) {
            if (this[fieldName] &&
                utils.isPlainObject(this[fieldName])) {
                var className = "models." + this.type.toLowerCase();

                var Class = classy.getClass(className);
                if (Class) {
                   this[fieldName] = new Class(this[fieldName], true);
                } else {
                   console.warn("Missing class for manual field!", className);
                }
            }
         }
      },

      // If we want to get/set variables outside of
      // the list that we get in "fields", we use
      // internal variables.  These are never serialized
      // to anything at all, so each object will ALWAYS
      // have their own unique copy.

      setInternalVariable: function(name, value) {
          this[name] = value;
      },

      getInternalVariable: function(name) {
          return this[name];
      },

      isEqualToModel: function(model) {
         if (!model) {
            return false;
         } else {
            return this.getInternalVariable('local_id') 
               === model.getInternalVariable('local_id');
         }
      },
      
      fromObject: function(config, isFromServer) {
         config = config || {};
         isFromServer = true === utils.isUndefinedOrNull(isFromServer) ? false : isFromServer;

         var fields = this.$ownClass.fields();

         Object.keys(fields).forEach(function(key) {
            // We clone because the static properties can be empty arrays or objects,
            // and we want a fresh copy of the array or object for each new object

            // NOTE: BACKBONE AND UNDERSCORE DO NOT CLONE (BUG)

            if (true === this.$ownClass.isManualKey(key)) {
               this[key] = utils.clone(config[this.$ownClass.mapKey(key, isFromServer)] || fields[key]);
            } else {
               this[key] = this.$ownClass.mapValue(config[this.$ownClass.mapKey(key, isFromServer)], fields[key], isFromServer); 
            }

         }, this);           
      },
      
      fromModel: function(model) {
         if (!utils.objectIsClassy(model, this.$ownClass)) {
            throw new Error("base.fromModel: Incompatible class! " + model.$ownClass);
         } else {
            this.fromObject(model.toObject());
         }
      },

      newModel: function(model) {
         if (!utils.objectIsClassy(model, this.$ownClass)) {
            throw new Error("base.newModel: Incompatible class!" + model.$ownClass);
         } else {
            var object = model.toObject();
            utils.removeKeysFromObject(object, this.$ownClass.serverFields());

            this.fromObject(object);
         }
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
      },

      allocateChildArray: function(variableName, count, isForServer) {
         for (var i = 0; i < count; i++) {
            this.pushOntoChildArray(variableName, isForServer);
         }
      },

      pushOntoChildArray: function(variableName, isServer) {
         return this.pushObjectOntoChildArray(variableName, {}, isServer);
      },

      addToChildArrayAtIndex: function(variableName, index, isServer) {
         return this.addObjectToChildArrayAtIndex(variableName, {}, index, isServer);
      },

      pushObjectOntoChildArray: function(variableName, object, isFromServer) {
         return this.addObjectToChildArrayAtIndex(variableName, object, null, isFromServer);
      },
      
      // If index is null, then it's assumed to be the end
      // of the array

      addObjectToChildArrayAtIndex: function(variableName, object, index, isForServer) {
         var defaultValue = this.$ownClass.fields()[variableName];

         if (!defaultValue) {
            throw new Error("pushOntoChildArray: Missing field ", variableName);
         } else {
            if (!utils.isArray(defaultValue)) {
               throw new Error("allocateChildArray: Field is not an array", variableName);
            } 

            var Class = this.$ownClass.getClassyFieldClass(defaultValue);
            if (!Class) {
               throw new Error("pushOntoChildArray: Invalid class ", variableName);
            }

            if (true === utils.isUndefinedOrNull(index)) {
               index = this[variableName].length;
            }

            var obj = new Class(object, isForServer);
            this[variableName].splice(index, 0, obj);
            return obj;
         }
      },

      pushModelOntoChildArray: function(variableName, model, isForServer) {
         return this.pushObjectOntoChildArray(variableName, model.toObject(isForServer), isForServer);
      },

      addModelToChildArrayAtIndex: function(variableName, model, index, isForServer) {
          return this.addObjectToChildArrayAtIndex(variableName, model.toObject(isForServer), index, isForServer);
      },

      deleteFromChildArray: function(variableName, model) {
         var arr = this[variableName];
         if (!arr) {
            throw new Error("deleteFromChildArray: Invalid variable", variableName);
         } else if (!utils.isArray(arr)) {
            throw new Error("deleteFromChildArray: Variable is not an array", variableName);
         } else {
            utils.inlineDeleteFromArray(arr, function(e) {
               return e.isEqualToModel(model);
            });
         }
      }
   })   
}])

module.exports = name