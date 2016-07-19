'use strict';

var mongoose = require('mongoose');

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.frontEndObject = function() {
      var object = {
         text: this.text,
         created_at: this.created_at,
         updated_at: this.updated_at
      };

      // For some stupid buggy reason, as this is an
      // embedded schema, we use mongoose deep populate
      // to populate the _creator with data.  HOWEVER,
      // this.populated does not work, and it acts as if
      // the _creator field isn't populated.
      
      // Therefore, we have to use a really stupid way
      // to see if we can indeed call the frontEndObject()
      // method.

      if (this._creator &&
          !mongoose.Types.ObjectId.isValid(this._creator)) {
         object['_creator'] = this._creator.frontEndObject();
      }

      return object;
   }
}