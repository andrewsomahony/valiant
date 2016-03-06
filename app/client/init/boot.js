'use strict';

function boot() {
    require('./app');
    require('./routes');
    
    var appInfo = require('../info');
    
    angular.bootstrap(document, [appInfo.name]);
}

module.exports = boot