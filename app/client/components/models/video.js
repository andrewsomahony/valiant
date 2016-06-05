'use strict';

var registerModel = require('./register');
var classy = require('classy');

var utils = require('utils');

var name = 'models.video';

registerModel(name, [require('models/base'),
function(BaseModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,
      
      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               url: "",
               subtitle_url: "",
               description: "",
               metadata: {},
               file_model: null,
               upload_progress: null
            });
         },
         
         localFields: function() {
            return this.staticMerge(this.callSuper(), [
               'file_model', 's3_upload_progress'
            ]);
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      },
      
      reset: function() {
         this.clearMetadata();
         this.setFileModel(null);
      },
      
      setFileModel: function(fileModel) {
         this.file_model = fileModel;
         
         if (fileModel) {
            this.url = fileModel.getUrl();
            console.log(this.url);
         } else {
            this.url = "";
         }
      },
      
      clearMetadata: function() {
         this.metadata = {};
      },
      
      setMetadata: function(metadata) {
         utils.extend(true, this.metadata, metadata);
      },
      
      getWidth: function() {
         if (this.metadata['width']) {
            return this.metadata['width'];
         } else {
            return -1;
         }
      },
      
      getHeight: function() {
         if (this.metadata['height']) {
            return this.metadata['height'];
         } else {
            return -1;
         }         
      }
   });
}])

module.exports = name;