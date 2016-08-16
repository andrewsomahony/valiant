'use strict';

var registerModel = require('models/register');

var classy = require('classy');

var utils = require('utils');

var name = 'models.user';

registerModel(name, [require('models/base'),
                     require('models/notification'),
                     require('models/picture'),
                     require('models/question'),
                     require('models/workout_builder/workout'),
function(BaseModel, NotificationModel,
PictureModel, QuestionModel, WorkoutModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               first_name: "",
               last_name: "",
               email: "",
               is_admin: false,
               profile_picture: {__model__: PictureModel},
               email_token: "",
               is_visible_to_users: true,
               is_visible_to_public: true,
               pending_email: "",
               pending_email_token: "",
               workouts: [{__model__: WorkoutModel}],
               questions: [{__model__: QuestionModel}],
               notifications: [{__model__: NotificationModel}]
            });
         },
         localFields: function() {
            return this.staticMerge(this.callSuper(), 
               ['workouts', 'questions']);
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
      },

      // The workout array is automatically
      // sorted by updated_at, with the most recent
      // one at the top.

      getLatestWorkout: function() {
         if (this.workouts.length) {
            return this.workouts[0];
         } else {
            return null;
         }
      },

      getNewNotifications: function() {
         return utils.grep(this.notifications, function(notification) {
            return notification.is_new;
         })
      },

      getUnreadNotifications: function() {
         return utils.grep(this.notifications, function(notification) {
            return notification.is_unread;
         });
      }
   })   
}]);

module.exports = name;