'use strict';

var m = require('./module');

module.exports = function(type, name, params) {
    if ('factory' === type) {
        m.factory(name, params);
    } else if ('service' === type) {
        m.service(name, params);
    } else if ('provider' === type) {
        m.provider(name, params);
    } else {
        
    }
}