'use strict';

var angular = require('angular');

var appInfo = require('../info');

module.exports = angular.module(appInfo.name, [require('angular-ui-router')]);