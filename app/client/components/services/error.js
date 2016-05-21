'use strict';

var registerService = require('services/register');

var name = 'services.error';

registerService('factory', name, [
    require('models/error'),
    require('models/http_response'),
function(ErrorModel, HttpResponseModel) {
    var localErrorCode = -999;
    
    function errorService(code, text) {
        var e = new ErrorModel({
            text: text,
            code: code
        });
        
        return e;
    }    
    
    errorService.localError = function(text) {
        return this(localErrorCode, text);
    }
    
    errorService.rejectLocalDeferred = function(text, deferredFn) {
        deferredFn(this.localError(text));
    }
    
    errorService.rejectDeferred = function(text, code, deferredFn) {
        deferredFn(this(code, text));
    }
    
    errorService.badRequest = function(error) {
        return 400 === error.code;
    }
    
    errorService.isForbidden = function(error) {
        return 403 === error.code;
    }
    
    errorService.isNotFound = function(error) {
        return 404 === error.code;
    }
    
    errorService.isUnauthorized = function(error) {
        return 401 === error.code;
    }
    
    return errorService;
}]);

module.exports = name;