'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.picture';

registerModel(name, [require('models/base'),
function(BaseModel) {
   console.log("REGISTERING PICTURE");
   return classy.define({
      extend: BaseModel,
      alias: name,
      
      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               url: "",
               description: "",
               metadata: {},
               file_model: null
            });
         },
         
         localFields: function() {
            return this.staticMerge(this.callSuper(), [
               'file_model'
            ]);
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
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