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

module.exports = SetElementSchema;