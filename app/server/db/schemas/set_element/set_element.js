'use strict';

var mongoose = require('mongoose');

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
   // This is an array, so we need to
   // save it all the time.
   
   this.intervals = this.intervals.filter(function(i) {
       return i ? true : false;
   })

   this.rests = this.rests.filter(function(r) {
       return r ? true : false;
   })

   this.markModified('intervals');
   this.markModified('rests');
   next();
});

module.exports = SetElementSchema;