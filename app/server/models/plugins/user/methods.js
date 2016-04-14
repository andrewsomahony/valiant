module.exports = function(schema, options) {
   options = options || {};
   
   schema.methods.unregisteredInformationObject = function() {
      return {
         email: this.email,
         email_token: this.email_token,
         created_at: this.created_at
      };
   }
}