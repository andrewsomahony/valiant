module.exports = function(schema, options) {
   options = options || {};
   
   schema.methods.getId = function() {
      return this._id;
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
         return {
            _id: this.getId(),
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name,
            profile_picture_url: this.profile_picture_url,
            access_type: this.access_type,
            questions: this.questions,
            notifications: this.notifications,
            created_at: this.created_at,
            is_visible_to_users: this.is_visible_to_users,
            is_visible_to_public: this.is_visible_to_public,
            is_admin: this.isAdmin()
         };
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