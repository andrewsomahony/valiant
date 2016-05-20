'use strict';

var mongoose = require('mongoose');
var UserSchema = require(__base + 'db/schemas/user/user');

module.exports = mongoose.model('User', UserSchema);