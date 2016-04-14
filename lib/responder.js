'use strict';

var ValiantError = require('./error');

function Responder(responseObject, responseCode, responseData) {
   responseObject.status(responseCode).json(responseData);
}

Responder.withError = function(responseObject, responseCode, responseMessage) {
   this(responseObject, responseCode, new ValiantError(responseMessage).toObject());
}

Responder.withMongooseError = function(responseObject, responseCode, mongooseError) {
   this(responseObject, responseCode, ValiantError.fromMongooseError(mongooseError).toObject());
}

Responder.methodNotAllowed = function(responseObject) {
   this(responseObject, 405, ValiantError.methodNotAllowed().toObject());
}

module.exports = Responder;