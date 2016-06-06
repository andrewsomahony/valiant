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
      
      // I don't really like how I structured this:
      // Storing a pointless array buffer instead of
      // the blob/file object is really silly, but
      // to change everything now is a bit of a headache,
      // but it seems like I'll have to :-/
      
      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               name: "",
               type: "",
               size: 0,
               blob: null,
               objectUrl: ""
            });
         },
         
         fromFileObject: function(fileObject) {
            var fileModel = new this();
            fileModel.setBlob(fileObject);
            
            return fileModel;
         },
         
         fromBlob: function(blob, name) {
            name = name || "";
            
            var fileModel = this.fromFileObject(blob);
            fileModel.name = name;
            
            return fileModel;
         },
         
         fromDataUrl: function(dataUrl, name) { 
            name = name || "";
            
            var fileModel = new this();
            
            fileModel.setDataUrl(dataUrl, name);
            
            return fileModel;
         },
         
         fromArrayBuffer: function(arrayBuffer, name) {
            name = name || "";
            
            var fileModel = new this();
            fileModel.setArrayBuffer(arrayBuffer, name);
            
            return fileModel;
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
            
            var fileModel = new FileModel();
            fileModel.setBlob(new Blob([buffer], {type: type}), name);

            return fileModel;
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      },
      
      setBlob: function(blob, name) {
         name = name || this.name || "";
         
         this.type = blob.type;
         this.size = blob.size;
         this.name = blob.name || name;
         this.blob = blob;
      },
      
      getText: function() {
         var self = this;
         
         return Promise(function(resolve, reject, notify) {
            self.getArrayBuffer()
            .then(function(data) {
               resolve(String.fromCharCode.apply(
                  null, new Uint8Array(data.arrayBuffer)));               
            })
            .catch(function(error) {
               reject(error);
            })
         });
      },
      
      getUint8Array: function() {
         var self = this;
         
         return Promise(function(resolve, reject, notify) {
            self.getArrayBuffer()
            .then(function(data) {
               resolve(new Uint8Array(data.arrayBuffer));
            }) 
            .catch(function(error) {
               reject(error);
            })            
         });
      },
      
      getArrayBuffer: function() {
         return FileReaderService.readAsArrayBufferPromiseHelper(this.blob);
      },
      
      setArrayBuffer: function(arrayBuffer, name) {
         var blob = new Blob([arrayBuffer]);
         
         this.setBlob(blob, name);
      },
      
      getUrl: function() {
         var urlCreator = window.URL || window.webkitURL;

         if (this.objectUrl) {
            urlCreator.revokeObjectURL(this.objectUrl);
         }      
      
         this.objectUrl = urlCreator.createObjectURL(this.blob);
      
         return this.objectUrl;
      },
      
      getDataUrl: function() {
         return FileReaderService.readAsDataUrlPromiseHelper(this.blob);
      },
      
      setDataUrl: function(dataUrl, name) {
         var blob = DataUrlService.dataUrlToBlob(dataUrl);
         
         this.setBlob(blob, name);
      }
   })
}])

module.exports = name;

