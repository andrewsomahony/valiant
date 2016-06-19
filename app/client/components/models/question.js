'use strict';

var registerModel = require('models/register');

var classy = require('classy');

var name = 'models.question';

registerModel(name, [require('models/base'),
                     require('models/video'),
                     require('models/picture'),
                     require('models/comment'),
function(BaseModel, VideoModel, PictureModel, CommentModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,
      
      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               topic: "",
               // IF someone has a question about something
               // that's not in my default drop-down,
               // they can use this one.
               
               // This also can show me how people use
               // the question page. 
               custom_topic: "",
               text: "",
               videos: [{__model__: VideoModel}],
               pictures: [{__model__: PictureModel}],
               comments: [{__model__: CommentModel}],
               preview_pictures: [{__model__: PictureModel}],
               youtube_video: {__model__: VideoModel}
            });
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      },
      
      allocateVideos: function(numberOfVideos) {
         this.videos = this.$ownClass.allocateChildArrayOfClasses('videos', numberOfVideos);
      },
      
      allocatePictures: function(numberOfPictures) {
         this.pictures = this.$ownClass.allocateChildArrayOfClasses('pictures', numberOfPictures, false);
      },

      allocatePreviewPictures: function(numberOfPictures) {
         this.preview_pictures = this.$ownClass.allocateChildArrayOfClasses('preview_pictures', numberOfPictures, false);
      }
   })
}
]);

module.exports = name;