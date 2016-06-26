'use strict';

module.exports = function(schema, options) {
   options = options || {};
   
   schema.methods.getId = function() {
      return this._id;
   }
   
   schema.methods.hasPendingEmail = function() {
      return this.pending_email;
   }
   
   schema.methods.isUser = function(otherUser) {
      return this.getId().equals(otherUser.getId());
   }
   
   // We don't need to return everything
   schema.methods.frontEndObject = function() {
      if (!this.isAuthenticated) {
         return {
            email: this.email,
            email_token: this.email_token,
            created_at: this.created_at
         };
      } else {
         var object = {
            _id: this.getId(),
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name,
            profile_picture: this.profile_picture,
            access_type: this.access_type,
            questions: this.questions,
            notifications: this.notifications,
            created_at: this.created_at,
            updated_at: this.updated_at,
            is_visible_to_users: this.is_visible_to_users,
            is_visible_to_public: this.is_visible_to_public,
            is_admin: this.isAdmin()
         };
         
         if (this.hasPendingEmail()) {
            object['pending_email'] = this.pending_email;
            object['pending_email_token'] = this.pending_email_token;
         }

         object.workouts = this.workouts.map(function(workout) {
            return workout.frontEndObject();
         });

         object.questions = this.questions.map(function(question) {
            // !!! TODO Give this a frontEndObject method
            return question;
         })
         
         return object;
      }
   }
   
   schema.methods.isOwner = function() {
      return 'owner' === this.access_type;
   }
   
   schema.methods.isAdmin = function() {
      return 'owner' === this.access_type ||
             'admin' === this.access_type;
   }
}