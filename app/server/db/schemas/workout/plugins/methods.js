var Promise = require(__base + '/lib/promise');

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.frontEndObject = function() {
      var object = {
         name: this.name,
         sets: this.sets,
         _id: this.id,
         created_at: this.created_at,
         updated_at: this.updated_at,         
      }

      if (this.fieldIsPopulated("_creator")) {
         object._creator = this._creator.frontEndObject();
      }

      return object;
   }
}