module.exports = function(schema, options) {
   options = options || {};

   schema.methods.frontEndObject = function() {
      var object = {
         name: this.name,
         sets: this.sets
      }

      if (this.populated("_creator")) {
         object._creator = this._creator.frontEndObject();
      }

      return object;
   }
}