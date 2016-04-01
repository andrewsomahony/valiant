'use strict';

var registerService = require('services/register');

var name = 'errorService';

registerService('factory', name, [
    require('models/error'),
function(ErrorModel) {
    function errorService(code, text) {
        var e = new ErrorModel({
            text: text,
            code: code
        });
        
        return e;
    }    
    
    return errorService;
}]);