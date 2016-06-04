'use strict';

var registerService = require('services/register');

var name = 'services.ffmpeg_service';

var utils = require('utils');

registerService('factory', name, [require('services/promise'),
                                  require('services/progress'),
                                  require('models/file'),
                                  require('services/error'),
function(Promise, ProgressService, FileModel,
ErrorService) {
    
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
    
    function sendCommandToWorker(command, file) {
       file = file || null;
       var messageData = {
          commandType: command,
          file: file
       };
       
       sendMessageToWorker(createWorkerMessage('command', messageData));
    }
    
    function fileModelToFFMpegFile(fileModel) {
       return Promise(function(resolve, reject, notify) {
          fileModel.getUint8Array()
          .then(function(array) {
             resolve({
                data: array,
                name: fileModel.name
             })
          })
          .catch(function(error) {
             reject(error);
          });         
       });
    }
    
    function bindWorkerMessageHandler(messageHandler) {
       worker.onmessage = messageHandler;
    }
    
    function getEventMessage(event) {
       return event.data;
    }
    
    function getEventMessageData(message) {
       return message.data;
    }
    
    FFMpegService.getVideoFileModelMetadata = function(fileModel) {
       return Promise(function(resolve, reject, notify) {
          FFMpegService.load()
          .then(function() {
             fileModelToFFMpegFile(fileModel)
             .then(function(file) {
                bindWorkerMessageHandler(function(event) {
                   var message = getEventMessage(event);
                   var data = getEventMessageData(message);
                
                   if ('start' === message.type) {
                    
                   } else if ('output' === message.type) {
                   } else if ('error' === message.type) {
                      reject(ErrorService.localError(data.result));
                   } else if ('done' === message.type) {
                      console.log("DATA", data);
                      resolve({SOMETHING_METADATA: "THIS IS TEMP METADATA"});
                   }
                });
             
                sendCommandToWorker('get_metadata', file);
             })
             .catch(function(error) {
                 reject(error);
             });
          })
          .catch(function(error) {
              reject(error);
          })      
       });
    }
    
    FFMpegService.load = function() {
       return Promise(function(resolve, reject, notify) {
          if (worker) {
             resolve();
          } else {
             worker = new Worker('/scripts/ffmpeg_util.js');

             bindWorkerMessageHandler(function(event) {
                var message = getEventMessage(event);
            
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

