'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TimeSchema = require(__base + 'db/schemas/time/time');

var SpeedTimeSchema = new Schema({
   name: {
      type: String,
      default: ""
   },
   time: TimeSchema
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    _id: false
});

module.exports = SpeedTimeSchema;