var util = require('util');

var mongooseErrorHelper = require('mongoose-error-helper').errorHelper;

function ValiantError(message) {
   Error.call(this);
   Error.captureStackTrace(this, arguments.callee);
   this.name = 'ValiantError';
   if (message && 'string' !== typeof message) {
       // Just using this to catch whenever I make a mistake
       // and don't initialize the errors properly.
       
       console.log("WARNING: Creating ValiantError with an object instead of a message! ", message);
   }
   this.message = message || "Valiant Error";
}

util.inherits(ValiantError, Error);

ValiantError.withMessage = function(message) {
   return new this(message);
}

ValiantError.fromMongooseError = function(mongooseError) {
   if (!mongooseError.name ||
       'ValidationError' !== mongooseError.name) {
      throw new Error("ValiantError.fromMongooseError: Invalid mongoose error object!");
   }
   return new this(mongooseError.toString())
}

ValiantError.fromErrorObject = function(errorObject) {
   if (!errorObject) {
      return new this();
   } else {
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
}

ValiantError.badRequest = function() {
    return new this("Bad request");
}

ValiantError.notFound = function() {
    return new this("Not found");
}

ValiantError.notAcceptable = function() {
    return new this("Not Acceptable");
}

ValiantError.methodNotAllowed = function() {
   return new this("Not allowed");
}

ValiantError.forbidden = function() {
    return new this("You don't have permission to do that");
}

ValiantError.unauthorized = function() {
    return new this("Unauthorized");
}

ValiantError.prototype.toObject = function() {
   return {error: this.message};
}

ValiantError.prototype.toString = function() {
   return this.message;
}

module.exports = ValiantError;