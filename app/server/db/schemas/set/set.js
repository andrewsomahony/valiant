'use strict';

var mongoose = require('mongoose');

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

module.exports = SetSchema;