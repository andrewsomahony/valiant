'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.picture';

registerModel(name, [require('models/base'),
function(BaseModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,
      
      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               url: "",
               description: "",
               metadata: {},
               file_model: null,
               upload_progress: null
            });
         },
         
         localFields: function() {
            return this.staticMerge(this.callSuper(), [
               'file_model', 'upload_progress'
            ]);
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      },

      hasMedia: function() {
         if (this.url) {
            return true;
         } else {
            return false;
         }
      },

      reset: function() {
         this.setFileModel(null);
         this.clearMetadata();
      },
      
      clearMetadata: function() {
         this.metadata = {};
      },

      // Basically, this function just looks
      // for keys that it understands, and
      // sets our metadata object's keys
      
      // metadata can be an exif data variable
      // from our exif service as well.
      
      setMetadata: function(metadata) {
         if (metadata['width']) {
            this.metadata['width'] = metadata['width'];
         }
         if (metadata['height']) {
            this.metadata['height'] = metadata['height']
         }
         if (metadata['type']) {
            this.metadata['type'] = metadata['type'];
         }
                  
         if (metadata['position_string']) {
            this.metadata['position'] = metadata['position_string'];
         }
      },
      
      setType: function(type) {
         this.setMetadata({type: type});
      },
      
      getType: function() {
         return this.metadata['type'] || "";
      },
      
      setFileModel: function(fileModel) {
         this.file_model = fileModel;
         if (fileModel) {
            this.url = fileModel.getUrl();
            this.setType(fileModel.type);
         } else {
            this.url = "";
         }
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