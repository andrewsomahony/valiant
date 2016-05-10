'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var name = 'fileModel';

registerModel(name, [require('models/base'),
function(BaseModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,
      
      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               name: "",
               type: "",
               size: 0,
               arrayBuffer: null,
               text: "",
               src: ""
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
                              src: src || "",
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

            return new this({
               type: type,
               size: text.length,
               name: name,
               text: text
            })
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      },
      
      toBlob: function() {
         if (this.arrayBuffer) {
            return new Blob([new Uint8Array(this.arrayBuffer)], 
                  {type: this.type});
         } else if (this.src) {
            // !!! Unimplemented
            // Need to convert base64 to blob
         } else if (this.text) {
            return new Blob([this.text], {type: "text/plain"});
         }
      }
      
   })
}])

module.exports = name;

