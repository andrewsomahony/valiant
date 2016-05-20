'use strict';

var mongoose = require('mongoose');
var QuestionSchema = require(__base + 'db/schemas/question/question');

module.exports = mongoose.model('Question', QuestionSchema);