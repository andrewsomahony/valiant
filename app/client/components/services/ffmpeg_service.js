'use strict';

var registerService = require('services/register');

var name = 'services.ffmpeg_service';

registerService('factory', name, [require('services/promise'),
                                  require('services/progress'),
function(Promise, ProgressService) {
    
    function FFMpegService() {
        
    }
    
    var worker = null;
    
    FFMpegService.load = function() {
      return Promise(function(resolve, reject, notify) {
        if (worker) {
          resolve();
        } else {
          worker = new Worker('/scripts/ffmpeg_util.js');

          worker.addEventListener('message', function(event) {
            var message = event.data;
            
            if ('ready' === message.type) {
              resolve();
            }
          });          
        }
      });
    }
 
    return FFMpegService;
    
}]);

module.exports = name;

