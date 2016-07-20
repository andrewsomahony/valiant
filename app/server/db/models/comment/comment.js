'use strict';

var mongoose = require('mongoose');
var CommentSchema = require(__base + 'db/schemas/comment/comment');

module.exports = mongoose.model('Comment', CommentSchema);