'use strict';

var mongoose = require('mongoose');
var WorkoutMethods = require('./plugins/methods');

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
   },
   _creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
});

WorkoutSchema.plugin(WorkoutMethods);

module.exports = WorkoutSchema;