'use strict';

var registerModel = require('models/register');

var classy = require('classy');

var name = 'models.user';

registerModel(name, [require('models/base'),
                     require('models/question'),
                     require('models/notification'),
function(BaseModel, QuestionModel, NotificationModel) {
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
               profile_picture_file: null,
               profile_picture: {__alias__: 'models.picture'},
               facebook_id: "",
               is_connected_to_facebook: false,
               email_token: "",
               is_visible_to_users: true,
               is_visible_to_public: true,
               pending_email: "",
               pending_email_token: ""
            });
         },
         localFields: function() {
            return this.staticMerge(this.callSuper(), ['profile_picture_file']);
         }
      },

      init: function(config, isFromServer) {
         this.callSuper()
      },
      
      fullName: function() {
         return this.first_name + " " + this.last_name;
      },
      
      setProfilePictureFile: function(file) {
         this.profile_picture_file = file;
         if (file) {
            this.profile_picture.url = file.getUrl();
         } else {
            this.profile_picture.url = "";
         }
      }
   })   
}]);

module.exports = name;