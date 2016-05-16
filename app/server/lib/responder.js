'use strict';

var ValiantError = require('./error');

function Responder() {
}

Responder.code = function(response, code) {
   response.status(code);
}

Responder.render = function(response, view, params) {
   response.render(view, params);
}

Responder.header = function(response, headerText) {
   response.header(headerText);
}

Responder.redirect = function(response, url) {
   response.redirect(url);
}

Responder.respond = function(response, code, data) {
   response.status(code).json(data || {});
}

Responder.withErrorObject = function(response, responseCode, errorObject) {
   this.respond(response, responseCode, ValiantError.fromErrorObject(errorObject).toObject());
}

Responder.withErrorMessage = function(response, responseCode, responseMessage) {
   this.respond(response, responseCode, new ValiantError(responseMessage).toObject());
}

Responder.withError = function(response, responseCode, error) {
   if ('string' === typeof error) {
      this.withErrorMessage(response, responseCode, error);
   } else {
      this.withErrorObject(response, responseCode, error);
   }
}

Responder.ok = function(response, responseData) {
   this.respond(response, 200, responseData);
}

Responder.created = function(response, responseData) {
   this.respond(response, 201, responseData);
}

Responder.accepted = function(response, responseData) {
   this.respond(response, 202, responseData);
}

Responder.noContent = function(response) {
   this.respond(response, 204);
}

Responder.badRequest = function(response, message) {
   this.withError(response, 400, message ? message : ValiantError.badRequest());
}

Responder.unauthorized = function(response, message) {
   this.withError(response, 401, message ? message : ValiantError.unauthorized());
}

Responder.notFound = function(response, message) {
   this.withError(response, 404, message ? message : ValiantError.notFound());
}

Responder.methodNotAllowed = function(response, message) {
   this.withError(response, 405, message ? message : ValiantError.methodNotAllowed());
}

Responder.notAcceptable = function(response, message) {
   this.withError(response, 406, message ? message : ValiantError.notAcceptable());
}

Responder.forbidden = function(response, message) {
   this.withError(response, 403, message ? message : ValiantError.forbidden());
}

module.exports = Responder;