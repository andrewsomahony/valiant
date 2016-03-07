'use strict';

var angular = require('angular');

require('../views/_views');

require('../components/controllers/init');
require('../components/filters/init');
require('../components/directives/init');
require('../components/animations/init');
require('../components/services/init');
require('../components/models/init');

var appInfo = require('info');

module.exports = angular.module(appInfo.name, [
    appInfo.moduleName('controllers'),
    appInfo.moduleName('filters'),
    appInfo.moduleName('directives'),
    appInfo.moduleName('animations'),
    appInfo.moduleName('services'),
    appInfo.moduleName('models'),
    appInfo.moduleName('views'),
    require('angular-ui-router')
]);