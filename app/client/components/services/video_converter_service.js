'use strict';

var registerService = require('services/register');

var name = 'services.video_converter';

registerService('factory', name, [require('services/promise'),
                                  require('services/progress'),
function(Promise, ProgressService) {
    
    function VideoConverterService() {
        
    }
    
    var worker = null;
    
    VideoConverterService.load = function() {
      return Promise(function(resolve, reject, notify) {
        if (worker) {
          resolve();
        } else {
          worker = new Worker('/scripts/video_converter.js');

          worker.addEventListener('message', function(event) {
            var message = event.data;
            
            if ('ready' === message.type) {
              resolve();
            }
          });          
        }
      });
    }
 
    return VideoConverterService;
    
}]);

module.exports = name;

