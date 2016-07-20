'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
   text: {
      type: String,
      default: ""
   },
   type: {
      type: String,
      default: ""
   },
   _parent: {
      type: Schema.Types.ObjectId,
      refPath: "type"
   },
   _creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
   }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = NotificationSchema;