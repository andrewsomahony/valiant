'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SetSchema = require(__base + 'db/schemas/set/set');

var WorkoutSchema = new Schema({
   name: {
      type: String,
      default: ""
   },
   sets: {
      type: [SetSchema],
      default: []
   }
});

module.exports = WorkoutSchema;