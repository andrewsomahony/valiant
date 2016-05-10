'use strict';

var registerModel = require('models/register');

var classy = require('classy');

var name = 'models.user';

registerModel(name, [require('models/base'),
function(BaseModel) {
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
               profile_picture_url: "",
               profile_picture_file: null,
               facebook_id: "",
               is_connected_to_facebook: false,
               email_token: "",
               is_visible_to_users: true,
               is_visible_to_public: true
            })
         },
         local_fields: function() {
            return this.staticMerge(this.callSuper(), ['profile_picture_file']);
         }
      },

      init: function(config, isFromServer) {
         this.callSuper()
      },
      
      fullName: function() {
         return this.first_name + " " + this.last_name;
      }
   })   
}]);

module.exports = name;