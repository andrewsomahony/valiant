'use strict';

var registerService = require('services/register');

var name = 'services.register';

registerService('factory', name, [require('models/video'),
                                  require('models/file'),
                                  require('services/promise'),
function(VideoModel, FileModel, Promise) {
   function VideoService() {
      
   }
   
   VideoService.getVideoFromFileModel = function(fileModel) {
      return Promise(function(resolve, reject, notify) {
         var video = new VideoModel();
         video.setFileModel(fileModel);
      
         resolve(video);        
      });

   }
   
   return VideoService;
}]);

module.exports = name;