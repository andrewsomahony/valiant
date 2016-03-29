'use strict';

var registerService = require('services/register');

var name = 'VideoConverter';

registerService('factory', name, [require('services/promise'),
                       require('services/progress'),
function(PromiseService, ProgressService) {
    
    function VideoConverterService() {
        
    }
    
    VideoConverterService.convert = function() {
        console.log(videoConverter);
    }
    
    return VideoConverterService;
    
}]);

module.exports = name;

