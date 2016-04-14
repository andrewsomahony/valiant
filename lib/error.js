var ValiantError = function(m) {
   this.message = m;
}

ValiantError.withMessage = function(message) {
   return new this(message);
}

ValiantError.fromMongooseError = function(mongooseError) {
   return new this(mongooseError.toString())
}

ValiantError.fromErrorObject = function(errorObject) {
   if ('string' === typeof errorObject) {
      errorObject = {message: errorObject};
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