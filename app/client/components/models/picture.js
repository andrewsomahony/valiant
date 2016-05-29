'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.picture';

registerModel(name, [require('models/base'),
                     require('services/exif_service'),
function(BaseModel, ExifService) {
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
               'file_model', 's3_upload_progress'
            ]);
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
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
         
         var latitudeLongitudeString = ExifService.parseLatitudeAndLongitude(metadata);
         
         if (latitudeLongitudeString) {
            this.metadata['position'] = latitudeLongitudeString;
         }
      },
      
      setType: function(type) {
         this.setMetadata({type: type});
      },
      
      getType: function() {
         return this.metadata['type'] || "";
      },
      
      setFileModel: function(fileModel) {
         this.clearMetadata();

         this.file_model = fileModel;
         if (fileModel) {
            this.url = fileModel.getUrl();
            
            if (fileModel.metadata) {
               console.log("METADATA, ", fileModel.metadata);
               this.setMetadata(fileModel.metadata);
            }
            
            if (fileModel.exifData) {
               console.log("EXIF, ", fileModel.exifData);
               this.setMetadata(fileModel.exifData);
            }
            
            if (fileModel.type) {
               this.setType(fileModel.type);
            } 
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