'use strict';

var mongoose = require('mongoose');
var utils = require(__base + 'lib/utils')

var Schema = mongoose.Schema;

var SetElementSchema = require(__base + 'db/schemas/set_element/set_element');

var SetSchema = new Schema({
   notes: {
      type: String,
      default: ""
   },
   quantity: {
      type: Number,
      default: 0
   },
   elements: {
      type: [SetElementSchema],
      default: []
   }
});

SetSchema.pre('save', function(next) {
   // This is an array, so we need to
   // save it all the time.
   
   this.elements = utils.filterOutUndefinedOrNull(this.elements);
   /*
   this.elements = this.elements.filter(function(e) {
       return e ? true : false;
   })*/

   this.markModified('elements');
   next();
});

module.exports = SetSchema;