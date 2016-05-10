'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var name = 'fileModel';

registerModel(name, [require('models/base'),
                     require('services/promise'),
function(BaseModel, Promise) {
   return classy.define({
      extend: BaseModel,
      alias: name,
      
      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               name: "",
               type: "",
               size: 0,
               arrayBuffer: null
            });
         },
         
         fromFileObject: function(fileObject, src, arrayBuffer) {
            // We probably won't use readAsText
            // from FileReader, as the arrayBuffer
            // will always be filled with the correct data,
            // which we get with readAsArrayBuffer
                        
            return new this({
                              type: fileObject.type,
                              size: fileObject.size,
                              name: fileObject.name,
                              arrayBuffer: arrayBuffer || null
                           });
         },

         fromText: function(text, name, type) {
            type = type || "text/plain"

            var extension = type.split('/').pop()

            if ('plain' === extension)
            {
               extension = 'txt'
            }

            name = name || "textFile." + extension

            var buffer = new Uint8Array(text);
            for (var i = 0; i < text.length; i++) {
                  buffer[i] = text.charCodeAt(i);
            }

            return new this({
               type: type,
               size: text.length,
               name: name,
               arrayBuffer: buffer
            })
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      },
      
      toBlob: function() {
         if (this.arrayBuffer) {
            return new Blob([this.arrayBuffer], 
                  {type: this.type});
         } else {
            return null;
         }
      },
      
      getUrl: function() {
         var blob = new Blob([this.arrayBuffer], {type: this.type});           
         var urlCreator = window.URL || window.webkitURL;
      
         return urlCreator.createObjectURL(blob);
      },
      
      getDataUrl: function() {
         return Promise(function(resolve, reject, notify) {
            var fileReader = new FileReader();
         
            fileReader.onload = function(e) {
               resolve(e.target.result);
            }
            fileReader.onerror = function(e) {
               reject();
            }
         
            fileReader.readAsDataUrl(this.toBlob());               
         });
      }
   })
}])

module.exports = name;

