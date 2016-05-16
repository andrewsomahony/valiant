'use strict';

module.exports = Request;
module.exports.getVariable = getVariable;
module.exports.getUser = getUser;
module.exports.getBodyVariable = getBodyVariable;
module.exports.getUrlVariable = getUrlVariable;
module.exports.getUrlParamVariable = getUrlParamVariable;

function Request() {
}

function getVariable(request, variable) {
   return request[variable];
}

function getUser(request) {
   return getVariable(request, 'user');
}

function getBodyVariable(request, variable) {
   return request.body[variable];
}

function getUrlVariable(request, variable) {
   return request.query[variable];
}

function getUrlParamVariable(request, variable) {
   return request.params[variable];
}
