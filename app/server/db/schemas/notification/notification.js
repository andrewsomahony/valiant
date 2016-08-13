'use strict';

var mongoose = require('mongoose');

var genericMethods = require(__base + "db/schemas/plugins/methods");
var notificationMethods = require('./plugins/methods');
var creatorMethods = require(__base + 'db/schemas/plugins/creator');

var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
   type: {
      type: String,
      default: ""
   },
   kind: {
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
   },
   is_new: {
      type: Boolean,
      default: true
   },
   is_unread: {
      type: Boolean,
      default: true
   }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

NotificationSchema.plugin(genericMethods);
NotificationSchema.plugin(creatorMethods);
NotificationSchema.plugin(notificationMethods);

module.exports = NotificationSchema;