'use strict';

module.exports = function() {
   return function(request, result, next) {
   request.isAjax = request.accepts('json') && request.xhr;
   next();
   }
}