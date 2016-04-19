module.exports = function(schema, options) {
   options = options || {};
   
   schema.methods.unregisteredInformationObject = function() {
      return {
         email: this.email,
         email_token: this.email_token,
         created_at: this.created_at
      };
   }
   
   // We don't need to return everything
   schema.methods.frontEndObject = function() {
      return {
         _id: this._id,
         email: this.email,
         first_name: this.first_name,
         last_name: this.last_name,
         profile_picture_url: this.profile_picture_url,
         access_type: this.access_type,
         questions: this.questions,
         notifications: this.notifications,
         created_at: this.created_at
      };
   }
}