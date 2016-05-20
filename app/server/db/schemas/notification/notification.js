'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
   text: {
      type: String,
      default: ""
   }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = NotificationSchema;