'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var workoutMethods = require('./plugins/methods');
var patchPlugin = require('mongoose-json-patch');

var SetSchema = require(__base + 'db/schemas/set/set');

var WorkoutSchema = new Schema({
   name: {
      type: String,
      default: ""
   },
   sets: {
      type: [SetSchema],
      default: []
   },
   _creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
});

WorkoutSchema.plugin(workoutMethods);
WorkoutSchema.plugin(patchPlugin);

module.exports = WorkoutSchema;