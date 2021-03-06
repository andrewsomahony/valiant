'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require(__base + 'lib/utils')

var workoutMethods = require('./plugins/methods');
var patchPlugin = require('mongoose-json-patch');
var userPatchPlugin = require(__base + 'db/schemas/plugins/patch');

var genericMethods = require(__base + 'db/schemas/plugins/methods');
var creatorMethods = require(__base + 'db/schemas/plugins/creator');

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
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

WorkoutSchema.pre('save', function(next) {
   // This is an array, so we need to
   // save it all the time.

   this.sets = utils.filterOutUndefinedOrNull(this.sets);
   
   this.markModified('sets');
   next();
});

WorkoutSchema.plugin(genericMethods);
WorkoutSchema.plugin(creatorMethods);

WorkoutSchema.plugin(workoutMethods);
WorkoutSchema.plugin(patchPlugin);
WorkoutSchema.plugin(userPatchPlugin);

module.exports = WorkoutSchema;