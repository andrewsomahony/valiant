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
            // We probably won't use readAsText
            // from FileReader, as the arrayBuffer
            // will always be filled with the correct data,
            // which we get with readAsArrayBuffer
            
            var fileModel = new this();
            fileModel.setBlob(fileObject);
            
            return fileModel;
                        
            /*return new this({
                              type: fileObject.type,
                              size: fileObject.size,
                              name: fileObject.name,
                              blob: fileObject
                           });*/
         },
         
         // This function takes a blob and returns
         // a file model initialized with an array buffer.
         
         // We pass in an optional name and exif data, as
         // this method generally is used when a file
         // is modified by a function that returns a blob
         
         fromBlob: function(blob, name) {
            name = name || "";

            //var self = this;
            
            var fileModel = this.fromFileObject(blob);
            fileModel.name = name;
            
            return fileModel;
            
            /*
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
            });*/
         },
         
         fromDataUrl: function(dataUrl, name) { 
            name = name || "";
            
            var fileModel = new this();
            
            fileModel.setDataUrl(dataUrl);
            fileModel.name = name;  
            
            return fileModel;
            /*       
            return Promise(function(resolve, reject, notify) {
               var blob = DataUrlService.dataUrlToBlob(dataUrl);
             
               if (!blob) {
                  reject(ErrorService.localError("Invalid data url!"));
               }
                  
               this.fromBlob(blob, name)
               .then(function(fileModel) {
                  resolve(fileModel);
               })
               .catch(function(e) {
                  reject(e);
               });                  
            });*/
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
            fileModel.setBlob(new Blob([buffer], type), name);

            return fileModel;
            /*
            return new this({
               type: type,
               size: text.length,
               name: name,
               arrayBuffer: buffer.buffer
            })*/
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
      /*
      
      toBlob: function() {
         if (this.arrayBuffer) {
            return new Blob([this.arrayBuffer], 
                  {type: this.type});
         } else {
            return null;
         }
      },*/
      
      getArrayBuffer: function() {
         return FileReaderService.readAsArrayBuffer(this.blob);
      },
      
      setArrayBuffer: function(arrayBuffer, name) {
         
      },
      
      getUrl: function() {
         //var blob = this.toBlob();//new Blob([this.arrayBuffer], {type: this.type});           
         var urlCreator = window.URL || window.webkitURL;

         if (this.objectUrl) {
            urlCreator.revokeObjectURL(this.objectUrl);
         }      
      
         this.objectUrl = urlCreator.createObjectURL(this.blob);
      
         return this.objectUrl;
      },
      
      getDataUrl: function() {
         return FileReaderService.readAsDataUrlPromiseHelper(this.toBlob());
      },
      
      setDataUrl: function(dataUrl, name) {
         var blob = DataUrlService.dataUrlToBlob(dataUrl);
         
         this.setBlob(blob, name);
         /*return Promise(function(resolve, reject, notify) {
            
            
            if (!blob) {
               reject(ErrorService.localError("Invalid data url!"));
            }
            
            this.fromBlob(blob, name)
            .then(function(fileModel) {
               resolve(fileModel);
            })
            .catch(function(e) {
               reject(e);
            });                  
         });*/
      }
   })
}])

module.exports = name;

