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
               thumbnail: {__alias__: "models.picture"},
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
      
      setThumbnail: function(thumbnail) {
         this.thumbnail.fromModel(thumbnail);  
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
         this.clearMetadata();
         
         if (metadata['info']) {
            utils.extend(true, this.metadata, metadata['info']);
         }
         
         this.metadata['video'] = {};
         this.metadata['audio'] = [];
         this.metadata['data'] = [];
         
         if (metadata['streams']) {
            var hasVideo = false;
            metadata['streams'].forEach(function(stream) {
               if ('video' === stream.type) {
                  if (true === hasVideo) {
                     // What do we do here?  Multiple video streams
                     // are part of container formats (mkv) that can't even seem
                     // to be selected by our file reader.  Furthermore, they don't even
                     // seem to work properly in VLC of all things, and Safari doesn't play them.
                     
                     // For now, just silently ignore any other video streams.
                  } else {
                     utils.extend(true, this.metadata['video'], stream);
                     hasVideo = true;
                  }
               } else if ('audio' === stream.type) {
                  this.metadata['audio'].push(stream);
               } else if ('data' === stream.type) {
                  this.metadata['data'].push(stream);
               }
            }, this);
         }
      },
      
      getWidth: function() {
         if (this.metadata['video'] &&
             this.metadata['video']['width']) {
            return this.metadata['video']['width'];
         } else {
            return -1;
         }
      },
      
      getHeight: function() {
         if (this.metadata['video'] &&
             this.metadata['video']['height']) {
            return this.metadata['video']['height'];
         } else {
            return -1;
         }        
      },
      
      getDuration: function() {
         return this.metadata['duration'] || null; 
      },
      
      getRotation: function() {
         if (this.metadata['video'] &&
             this.metadata['video']['metadata']) {
            return this.metadata['video']['metadata']['rotation'] || 0;        
         } else {
            return 0;
         }
      },
      
      getVideoCodec: function() {
         if (this.metadata['video'] &&
             this.metadata['video']['codec']) {
            return this.metadata['video']['codec'];       
         } else {
            return "";
         }
      },
      
      getNumberOfFrames: function() {
         if (this.metadata['duration'] &&
             this.metadata['video'] &&
             this.metadata['video']['fps']) {
            return utils.round(this.metadata['duration'] *
               this.metadata['video']['fps'], 0);    
         } else {
            return null;
         }
      },
      
      getAudioCodecs: function() {
         if (this.metadata['audio']) {
            return this.metadata['audio'].map(function(audioStream) {
               return audioStream.codec || "";
            }) 
         } else {
            return [];
         }
      }
   });
}])

module.exports = name;