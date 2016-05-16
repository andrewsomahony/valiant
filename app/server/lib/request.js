'use strict';

module.exports = Request;
module.exports.getVariable = getVariable;
module.exports.getUser = getUser;
module.exports.getBodyVariable = getBodyVariable;
module.exports.getUrlVariable = getUrlVariable;
module.exports.getUrlParamVariable = getUrlParamVariable;

var request = null;

function Request() {
   return function(req, result, next) {
      request = req;
      next();
   };
}

function getVariable(variable) {
   return request[variable];
}

function getUser() {
   return getVariable('user');
}

function getBodyVariable(variable) {
   return request.body[variable];
}

function getUrlVariable(variable) {
   return request.query[variable];
}

function getUrlParamVariable(variable) {
   return request.params[variable];
}
