'use strict';

var m = require('./module');

module.exports = function(name, params) {
    m.controller(name, params);
}