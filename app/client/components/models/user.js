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
               facebook_id: "",
               is_connected_to_facebook: false
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper()
      }
   })   
}]);

module.exports = name;