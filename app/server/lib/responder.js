'use strict';

var ValiantError = require('./error');

function Responder(responseObject, responseCode, responseData) {
   responseObject.status(responseCode).json(responseData || {});
}

Responder.withErrorObject = function(responseObject, responseCode, errorObject) {
   this(responseObject, responseCode, ValiantError.fromErrorObject(errorObject).toObject());
}

Responder.withErrorMessage = function(responseObject, responseCode, responseMessage) {
   this(responseObject, responseCode, new ValiantError(responseMessage).toObject());
}

Responder.withMongooseError = function(responseObject, responseCode, mongooseError) {
   this(responseObject, responseCode, ValiantError.fromMongooseError(mongooseError).toObject());
}

Responder.withError = function(responseObject, responseCode, error) {
   if ('string' === typeof error) {
      this.withErrorMessage(responseObject, responseCode, error);
   } else {
      this.withErrorObject(responseObject, responseCode, error);
   }
}

Responder.ok = function(responseObject, responseData) {
   this(responseObject, 200, responseData);
}

Responder.noContent = function(responseObject) {
   this(responseObject, 204);
}

Responder.badRequest = function(responseObject, error) {
   this.withError(responseObject, 400, error);
}

Responder.notFound = function(responseObject, error) {
   this.withError(responseObject, 404, error);
}

Responder.methodNotAllowed = function(responseObject) {
   this(responseObject, 405, ValiantError.methodNotAllowed().toObject());
}

Responder.forbidden = function(responseObject, message) {
   this.withError(responseObject, 403, message ? message : ValiantError.forbidden().toObject());
}

module.exports = Responder;