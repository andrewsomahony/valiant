'use strict';

var mongoose = require('mongoose');

var patchPlugin = require('mongoose-json-patch');

module.exports = function() {
   mongoose.plugin(patchPlugin);
}