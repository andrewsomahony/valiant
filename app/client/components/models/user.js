'use strict';

var registerModel = require('models/register');

var classy = require('classy');

var name = 'models.user';

registerModel(name, [require('models/base'),
                     require('models/question'),
                     require('models/notification'),
                     require('models/picture'),
function(BaseModel, QuestionModel, NotificationModel,
PictureModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               first_name: "",
               last_name: "",
               email: "",
               password: "",
               profile_picture: {__model__: PictureModel},
               facebook_id: "",
               is_connected_to_facebook: false,
               email_token: "",
               is_visible_to_users: true,
               is_visible_to_public: true,
               pending_email: "",
               pending_email_token: ""
            });
         }
      },

      init: function(config, isFromServer) {
         this.callSuper()
      },
      
      fullName: function() {
         return this.first_name + " " + this.last_name;
      },
      
      setProfilePicture: function(picture) {
         if (!picture) {
            this.profile_picture.fromObject({});
         } else {
            this.profile_picture.fromModel(picture);
         }
      }
   })   
}]);

module.exports = name;