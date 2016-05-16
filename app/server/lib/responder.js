'use strict';

var ValiantError = require('./error');

var response = null;

function Responder() {
   return function(request, res, next) {
      response = res;
      next();
   }
}

Responder.respond = function(code, data) {
   response.status(code).json(data || {});
}

Responder.withErrorObject = function(responseObject, responseCode, errorObject) {
   this.respond(responseCode, ValiantError.fromErrorObject(errorObject).toObject());
}

Responder.withErrorMessage = function(responseObject, responseCode, responseMessage) {
   this.respond(responseCode, new ValiantError(responseMessage).toObject());
}

Responder.withError = function(responseObject, responseCode, error) {
   if ('string' === typeof error) {
      this.withErrorMessage(responseObject, responseCode, error);
   } else {
      this.withErrorObject(responseObject, responseCode, error);
   }
}

Responder.ok = function(responseObject, responseData) {
   this.respond(200, responseData);
}

Responder.created = function(responseObject, responseData) {
   this.respond(201, responseData);
}

Responder.accepted = function(responseObject, responseData) {
   this.respond(202, responseData);
}

Responder.noContent = function(responseObject) {
   this.respond(204);
}

Responder.badRequest = function(responseObject, message) {
   this.withError(responseObject, 400, message ? message : ValiantError.badRequest());
}

Responder.unauthorized = function(responseObject, message) {
   this.withError(responseObject, 401, message ? message : ValiantError.unauthorized());
}

Responder.notFound = function(responseObject, message) {
   this.withError(responseObject, 404, message ? message : ValiantError.notFound());
}

Responder.methodNotAllowed = function(responseObject, message) {
   this.withError(responseObject, 405, message ? message : ValiantError.methodNotAllowed());
}

Responder.forbidden = function(responseObject, message) {
   this.withError(responseObject, 403, message ? message : ValiantError.forbidden());
}

module.exports = Responder;