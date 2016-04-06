'use strict';

function boot() {
    require('./app');
    require('./routes');
    require('./config');
    
    var appInfo = require('../info');
    
    angular.bootstrap(document, [appInfo.name]);
}

module.exports = boot