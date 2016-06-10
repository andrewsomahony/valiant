'use strict';

var registerService = require('services/register');

var name = 'services.register';

registerService('factory', name, [require('models/video'),
                                  require('models/file'),
                                  require('services/promise'),
                                  require('services/serial_promise'),
                                  require('services/ffmpeg_service'),
                                  require('services/progress'),
function(VideoModel, FileModel, Promise, 
SerialPromise, FFMpegService, ProgressService) {
   function VideoService() {
      
   }
   
   VideoService.videoIsHTML5 = function(video) {
      var validVideoCodecs = ["h264"];
      return -1 !== validVideoCodecs.indexOf(video.getVideoCodec());
   }
   
   VideoService.convertVideoToHTML5 = function(video) {
      return Promise(function(resolve, reject, notify) {
         if (true === VideoService.videoIsHTML5(video)) {
            resolve(video);
         } else {
            var promiseFnArray = [];
            
            promiseFnArray.push(function(existingData, index, forNotify) {
               if (true === forNotify) {
                  return ProgressService(0, video.getNumberOfFrames());
               } else {
                  return Promise(function(resolve, reject, notify) {
                     FFMpegService.convertVideoToHTML5(video)
                     .then(function(newFileModel) {
                        resolve({fileModel: newFileModel});
                     }, null, function(progress) {
                        notify(progress);
                     })
                     .catch(function(error) {
                        reject(error);
                     });
                  })
               }
            });
            
            promiseFnArray.push(function(existingData, index, forNotify) {
               if (false === forNotify) {
                  return Promise(function(resolve, reject, notify) {
                     VideoService.getVideoFromFileModel(existingData.fileModel)
                     .then(function(newVideo) {
                        resolve({video: newVideo});
                     })
                     .catch(function(error) {
                        reject(error);
                     });
                  });
               }
            });
            
            SerialPromise.withNotify(promiseFnArray, null, ['video'], true)
            .then(function(video) {
               resolve(video);
            }, null, function(progress) {
               notify(progress);
            })
            .catch(function(error) {
               reject(error);
            })
         }
      });
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
   
   VideoService.getVideoThumbnail = function(video) {
      return Promise(function(resolve, reject, notify) {
         FFMpegService.getVideoThumbnail(video)
         .then(function(picture) {
            video.setThumbnail(picture);
            resolve(video);
         })
         .catch(function(error) {
            reject(error);
         })         
      });
   }
   
   return VideoService;
}]);

module.exports = name;