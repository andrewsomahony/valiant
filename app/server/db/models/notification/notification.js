'use strict';

var mongoose = require('mongoose');
var NotificationSchema = require(__base + "db/schemas/notification/notification");

module.exports = mongoose.model('Notification', NotificationSchema);
