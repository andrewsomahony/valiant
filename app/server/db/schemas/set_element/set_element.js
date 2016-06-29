'use strict';

var mongoose = require('mongoose');
var utils = require(__base + 'lib/utils');

var Schema = mongoose.Schema;

var SpeedTimeSchema = require(__base + 'db/schemas/speed_time/speed_time');

var SetElementSchema = new Schema({
   notes: {
      type: String,
      default: ""
   },
   quantity: {
      type: Number,
      default: 0
   },
   distance: {
      type: Number,
      default: 0
   },
   type: {
      type: String,
      default: ""
   },
   stroke: {
      type: String,
      default: ""
   },
   stroke_modification: {
      type: String,
      default: ""
   },
   intervals: {
      type: [SpeedTimeSchema],
      default: []
   },
   rests: {
      type: [SpeedTimeSchema],
      default: []
   }
});

SetElementSchema.pre('save', function(next) {
   // These are arrays, so we need to
   // save them all the time.
   
   this.intervals = utils.filterOutUndefinedOrNull(this.intervals);
   this.rests = utils.filterOutUndefinedOrNull(this.rests);

   this.markModified('intervals');
   this.markModified('rests');
   next();
});

module.exports = SetElementSchema;