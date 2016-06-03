'use strict';

var registerService = require('services/register');

var name = 'services.ffmpeg_service';

registerService('factory', name, [require('services/promise'),
                                  require('services/progress'),
                                  require('models/file'),
function(Promise, ProgressService, FileModel) {
    
    function FFMpegService() {
        
    }
    
    var worker = null;

    function createWorkerMessage(messageType, data) {
       return {
          type: messageType,
          data: data
       };
    }
    
    function sendMessageToWorker(message) {
       worker.postMessage(message);
    }
    
    FFMpegService.load = function() {
      return Promise(function(resolve, reject, notify) {
        if (worker) {
          resolve();
        } else {
          worker = new Worker('/scripts/ffmpeg_util.js');

          worker.onmessage = function(event) {
            var message = event.data;
            
            if ('ready' === message.type) {
              resolve();
            }
          };          
        }
      });
    }
 
    return FFMpegService;
    
}]);

module.exports = name;

