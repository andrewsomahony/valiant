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
               videos: [{__alias__: 'models.video'}],
               pictures: [{__alias__: 'models.picture'}],
               comments: [{__alias__: 'models.comment'}],
               preview_pictures: [{__alias__: 'models.picture'}],
               youtube_video: {__alias__: 'models.video'}
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
      }
   })
}
]);

module.exports = name;