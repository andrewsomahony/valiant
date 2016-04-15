var util = require('util');

var mongooseErrorHelper = require('mongoose-error-helper').errorHelper;

function ValiantError(message) {
   Error.call(this);
   Error.captureStackTrace(this, arguments.callee);
   this.name = 'ValiantError';
   this.message = message || null;
}

util.inherits(ValiantError, Error);

ValiantError.withMessage = function(message) {
   return new this(message);
}

ValiantError.fromMongooseError = function(mongooseError) {
   if (!mongooseError.name ||
       'ValidtationError' !== mongooseError.name) {
      throw new Error("ValiantError.fromMongooseError: Invalid mongoose error object!");
   }
   return new this(mongooseError.toString())
}

ValiantError.fromErrorObject = function(errorObject) {
   if ('string' === typeof errorObject) {
      errorObject = {message: errorObject};
   } else {
      if (errorObject.name) {
         if ('ValiantError' === errorObject.name) {
            return errorObject;
         } else if ('ValidationError' === errorObject.name) {
            // Mongoose error
            return this.fromMongooseError(errorObject);
         }
      }
   }
   
   if (errorObject.message) {
      return new this(errorObject.message);
   } else {
      return new this(errorObject);   
   }
}

ValiantError.methodNotAllowed = function() {
   return new this("Not allowed");
}

ValiantError.prototype.toObject = function() {
   return {error: this.message};
}

module.exports = ValiantError;