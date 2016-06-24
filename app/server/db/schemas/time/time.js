'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TimeSchema = new Schema({
   hour: {
      type: Number,
      default: 0
   },
   minute: {
      type: Number,
      default: 0
   },
   second: {
      type: Number,
      default: 0
   },
   sub_second: {
      type: Number,
      default: 0
   }
});

module.exports = TimeSchema;