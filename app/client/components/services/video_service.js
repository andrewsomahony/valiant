'use strict';

var registerService = require('services/register');

var name = 'services.register';

registerService('factory', name, [require('models/video'),
                                  require('models/file'),
                                  require('services/promise'),
                                  require('services/serial_promise'),
                                  require('services/ffmpeg_service'),
function(VideoModel, FileModel, Promise, 
SerialPromise, FFMpegService) {
   function VideoService() {
      
   }
   
   VideoService.getVideoFromFileModel = function(fileModel) {
      var promiseFnArray = [];
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (false === forNotify) {
            return Promise(function(resolve, reject, notify) {
               FFMpegService.getVideoFileModelMetadata(fileModel)
               .then(function(metadata) {
                  resolve({metadata: metadata});
               })
               .catch(function(error) {
                  reject(error);
               })            
            });
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (false === forNotify) {
            return Promise(function(resolve, reject, notify) {
               var video = new VideoModel();
               video.setFileModel(fileModel);
               video.setMetadata(existingData.metadata);
               
               console.log(video);
               resolve({video: video});
            });
         }
      });
      
      return SerialPromise.withNotify(promiseFnArray, null, ['video'], true);
   }
   
   return VideoService;
}]);

module.exports = name;