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

Responder.methodNotAllowed = function(responseObject) {
   this(responseObject, 405, ValiantError.methodNotAllowed().toObject());
}

Responder.noContent = function(responseObject) {
   this(responseObject, 204);
}

module.exports = Responder;