'use strict';

var registerModel = require('./register');
var classy = require('classy');

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
      
      getWidth: function() {
         
      },
      
      getHeight: function() {
         
      }
   });
}])

module.exports = name;