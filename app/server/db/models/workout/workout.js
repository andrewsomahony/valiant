'use strict';

var mongoose = require('mongoose');
var WorkoutSchema = require(__base + 'db/schemas/workout/workout');

module.exports = mongoose.model('Workout', WorkoutSchema);
