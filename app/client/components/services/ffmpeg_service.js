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
    
    function getEventMessageDataOutput(data) {
       return data.full_output;
    }
    
    function getEventMessageDataResult(data) {
       return data.result;
    }
    
    function parseMetadata(metadata) {
/*
ffmpeg version 2.2.1 Copyright (c) 2000-2014 the FFmpeg developers  built on Jun  9 2014 20:24:32 with emcc (Emscripten GCC-like replacement) 1.12.0 (commit 6960d2296299e96d43e694806f5d35799ef8d39c)  configuration: --cc=emcc --prefix=/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist --extra-cflags='-I/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/include -v' --enable-cross-compile --target-os=none --arch=x86_32 --cpu=generic --disable-ffplay --disable-ffprobe --disable-ffserver --disable-asm --disable-doc --disable-devices --disable-pthreads --disable-w32threads --disable-network --disable-hwaccels --disable-parsers --disable-bsfs --disable-debug --disable-protocols --disable-indevs --disable-outdevs --enable-protocol=file --enable-libvpx --enable-gpl --extra-libs='/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/lib/libx264.a /Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/lib/libvpx.a'  libavutil      52. 66.100 / 52. 66.100  libavcodec     55. 52.102 / 55. 52.102  libavformat    55. 33.100 / 55. 33.100  libavdevice    55. 10.100 / 55. 10.100  libavfilter     4.  2.100 /  4.  2.100  libswscale      2.  5.102 /  2.  5.102  libswresample   0. 18.100 /  0. 18.100  libpostproc    52.  3.100 / 52.  3.100[h264 @ 0xee0820] Warning: not compiled with thread support, using thread emulation[aac @ 0xee8eb0] Warning: not compiled with thread support, using thread emulationInput #0, mov,mp4,m4a,3gp,3g2,mj2, from '11814676_10153463694786788_781424206_n.mp4':  Metadata:    major_brand     : isom    minor_version   : 512    compatible_brands: isomiso2avc1mp41    title           : 10153463693781788    encoder         : Lavf56.4.101  Duration: 00:01:39.85, start: 0.114694, bitrate: 268 kb/s    Stream #0:0(und): Video: h264 (Constrained Baseline) (avc1 / 0x31637661), yuv420p, 400x222, 215 kb/s, 29.98 fps, 29.98 tbr, 14988 tbn, 59.95 tbc (default)    Metadata:      handler_name    : VideoHandler    Stream #0:1(und): Audio: aac (mp4a / 0x6134706D), 44100 Hz, stereo, fltp, 48 kb/s (default)    Metadata:      handler_name    : SoundHandler[libx264 @ 0xed8f80] Warning: not compiled with thread support, using thread emulation[libx264 @ 0xed8f80] using cpu capabilities: none![libx264 @ 0xed8f80] profile High, level 1.3[libx264 @ 0xed8f80] 264 - core 142 - H.264/MPEG-4 AVC codec - Copyright 2003-2014 - http://www.videolan.org/x264.html - options: cabac=1 ref=3 deblock=1:0:0 analyse=0x3:0x113 me=hex subme=7 psy=1 psy_rd=1.00:0.00 mixed_ref=1 me_range=16 chroma_me=1 trellis=1 8x8dct=1 cqm=0 deadzone=21,11 fast_pskip=1 chroma_qp_offset=-2 threads=1 lookahead_threads=1 sliced_threads=0 nr=0 decimate=1 interlaced=0 bluray_compat=0 constrained_intra=0 bframes=3 b_pyramid=2 b_adapt=1 b_bias=0 direct=1 weightb=1 open_gop=0 weightp=2 keyint=250 keyint_min=25 scenecut=40 intra_refresh=0 rc_lookahead=40 rc=crf mbtree=1 crf=23.0 qcomp=0.60 qpmin=0 qpmax=69 qpstep=4 ip_ratio=1.40 aq=1:1.00[aac @ 0xed9c50] The encoder 'aac' is experimental but experimental codecs are not enabled, add '-strict -2' if you want to use it.
*/   

/*
ffmpeg version 2.2.1 Copyright (c) 2000-2014 the FFmpeg developers  built on Jun  9 2014 20:24:32 with emcc (Emscripten GCC-like replacement) 1.12.0 (commit 6960d2296299e96d43e694806f5d35799ef8d39c)  configuration: --cc=emcc --prefix=/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist --extra-cflags='-I/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/include -v' --enable-cross-compile --target-os=none --arch=x86_32 --cpu=generic --disable-ffplay --disable-ffprobe --disable-ffserver --disable-asm --disable-doc --disable-devices --disable-pthreads --disable-w32threads --disable-network --disable-hwaccels --disable-parsers --disable-bsfs --disable-debug --disable-protocols --disable-indevs --disable-outdevs --enable-protocol=file --enable-libvpx --enable-gpl --extra-libs='/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/lib/libx264.a /Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/lib/libvpx.a'  libavutil      52. 66.100 / 52. 66.100  libavcodec     55. 52.102 / 55. 52.102  libavformat    55. 33.100 / 55. 33.100  libavdevice    55. 10.100 / 55. 10.100  libavfilter     4.  2.100 /  4.  2.100  libswscale      2.  5.102 /  2.  5.102  libswresample   0. 18.100 /  0. 18.100  libpostproc    52.  3.100 / 52.  3.100[h264 @ 0xee0850] Warning: not compiled with thread support, using thread emulation[aac @ 0xed8d30] Warning: not compiled with thread support, using thread emulationInput #0, mov,mp4,m4a,3gp,3g2,mj2, from 'soccer_small.m4v':  Metadata:    major_brand     : M4V     minor_version   : 1    compatible_brands: M4V M4A mp42isom    creation_time   : 2012-07-02 05:15:16  Duration: 00:01:16.51, start: 0.000000, bitrate: 1709 kb/s    Stream #0:0(eng): Video: h264 (Constrained Baseline) (avc1 / 0x31637661), yuv420p(tv, smpte170m), 640x360, 1602 kb/s, 29.97 fps, 29.97 tbr, 2997 tbn, 5994 tbc (default)    Metadata:      creation_time   : 2012-07-02 05:15:16      handler_name    : Apple Video Media Handler    Stream #0:1(eng): Audio: aac (mp4a / 0x6134706D), 44100 Hz, stereo, fltp, 103 kb/s (default)    Metadata:      creation_time   : 2012-07-02 05:15:16      handler_name    : Apple Sound Media Handler[libx264 @ 0xedd110] Warning: not compiled with thread support, using thread emulation[libx264 @ 0xedd110] using cpu capabilities: none![libx264 @ 0xedd110] profile High, level 3.0[libx264 @ 0xedd110] 264 - core 142 - H.264/MPEG-4 AVC codec - Copyright 2003-2014 - http://www.videolan.org/x264.html - options: cabac=1 ref=3 deblock=1:0:0 analyse=0x3:0x113 me=hex subme=7 psy=1 psy_rd=1.00:0.00 mixed_ref=1 me_range=16 chroma_me=1 trellis=1 8x8dct=1 cqm=0 deadzone=21,11 fast_pskip=1 chroma_qp_offset=-2 threads=1 lookahead_threads=1 sliced_threads=0 nr=0 decimate=1 interlaced=0 bluray_compat=0 constrained_intra=0 bframes=3 b_pyramid=2 b_adapt=1 b_bias=0 direct=1 weightb=1 open_gop=0 weightp=2 keyint=250 keyint_min=25 scenecut=40 intra_refresh=0 rc_lookahead=40 rc=crf mbtree=1 crf=23.0 qcomp=0.60 qpmin=0 qpmax=69 qpstep=4 ip_ratio=1.40 aq=1:1.00[aac @ 0xeddc60] The encoder 'aac' is experimental but experimental codecs are not enabled, add '-strict -2' if you want to use it.

 */     
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
                      console.log("FULL OUTPUT", getEventMessageDataOutput(data));
                      console.log("RESULT", getEventMessageDataResult(data));
                      
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

