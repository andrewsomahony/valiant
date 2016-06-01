'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var name = 'fileModel';

registerModel(name, [require('models/base'),
                     require('services/file_reader_service'),
                     require('services/data_url_service'),
                     require('services/promise'),
                     require('services/error'),
function(BaseModel, FileReaderService, DataUrlService, Promise,
ErrorService) {
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
               objectUrl: "",
               //exifData: {},
               //metadata: {}
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
         
         // This function takes a blob and returns
         // a file model initialized with an array buffer.
         
         // We pass in an optional name and exif data, as
         // this method generally is used when a file
         // is modified by a function that returns a blob
         
         fromBlob: function(blob, name) {
            name = name || "";

            var self = this;
            
            return Promise(function(resolve, reject, notify) {
               FileReaderService.readAsArrayBuffer(blob)
               .then(function(arrayBuffer) {
                  var fileModel = self.fromFileObject(blob, null, arrayBuffer);
                  fileModel.name = name;
                  
                  resolve(fileModel);
               })
               .catch(function(e) {
                  reject(e);   
               });                  
            });
         },
         
         fromDataUrl: function(dataUrl, name) {            
            return Promise(function(resolve, reject, notify) {
               var blob = DataUrlService.dataUrlToBlob(dataUrl);
             
               if (!blob) {
                  reject(ErrorService.localError("Invalid data url!"));
               }
                  
               this.fromBlob(blob, name)
               .then(function(file) {
                  resolve(file);
               })
               .catch(function(e) {
                  reject(e);
               });                  
            });
         },

         fromText: function(text, name, type) {
            type = type || "text/plain"

            var extension = type.split('/').pop()

            if ('plain' === extension) {
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

         if (this.objectUrl) {
            urlCreator.revokeObjectURL(this.objectUrl);
         }      
      
         this.objectUrl = urlCreator.createObjectURL(blob);
      
         return this.objectUrl;
      },
      
      getDataUrl: function() {
         return FileReaderService.readAsDataUrl(this.toBlob());
      }
   })
}])

module.exports = name;

