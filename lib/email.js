'use strict';

var appConfig = require(__base + 'config/config');
var sendgridKey = 'WHEREARE_MUH_ROADS';
var sendgrid = require('sendgrid')(appConfig.secure(sendgridKey));

module.exports = function(options) {
   
}