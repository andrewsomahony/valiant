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
               text: "",
               videos: [{__alias__: 'models.video'}],
               pictures: [{__alias__: 'models.picture'}],
               comments: [{__alias__: 'models.comment'}],
               preview_pictures: [{__alias__: 'models.picture'}]
            });
         }
      },
      
      init: function(config, isFromServer) {
         this.callSuper();
      }
   })
}
]);

module.exports = name;