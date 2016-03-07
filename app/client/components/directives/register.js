'use strict';

var m = require('./module');

module.exports = function(name, parameters) {
    m.directive(name, parameters);
}