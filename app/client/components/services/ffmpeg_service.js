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
    
    function parseMediaMetadataInfoString(metadataInfoString) {
       var returnObject = {};
       
       var encoderMatch = metadataInfoString.match(/encoder\s*:\s*([^\s]+)/i)
       
       if (encoderMatch) {
          returnObject['encoder'] = encoderMatch[1]; 
       }
       
       var creationTimeMatch = metadataInfoString.match(/creation_time\s*:\s*(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/i);
       
       if (creationTimeMatch) {
          returnObject['creation_time'] = creationTimeMatch[1];
       }
       
       var durationMatch = metadataInfoString.match(/Duration:\s*(\d{2}:\d{2}:\d{2}.\d{2}),\s*start:\s*([\d\.]+),\s*bitrate:\s*(\d+\s*kb\/s|N\/A)/i);
       
       if (durationMatch) {
          returnObject['duration'] = utils.parseTimeStringToSeconds(durationMatch[1]);
          returnObject['start'] = parseFloat(durationMatch[2]);
          returnObject['bitrate'] = durationMatch[3];
       }
       
       return returnObject;
    }
    
    function parseMediaMetadataOutputFile(text) {
       //;FFMETADATA1↵major_brand=qt  ↵minor_version=0↵compatible_brands=qt  ↵description=Intro to the swim videos↵title=Swim Video Intro↵
       
       var returnObject = {};
       
       var signatureMatch = text.match(/^;ffmetadata(\d+)\n/i);
       
       if (!signatureMatch) {
          throw new Error("parseMediaMetadataOutputFile: Invalid metadata output file");
       }
       
       function createMetadataRegexForVariable(variableName) {
          return new RegExp("" + variableName + "\=(\.+)\s*\n?", "i");
       }
       
       function saveVariable(variableName) {
          var regex = createMetadataRegexForVariable(variableName);
          
          var matchObject = text.match(regex);
          
          if (matchObject) {
             returnObject[variableName] = matchObject[1].trim();
          }
       }
       
       saveVariable('major_brand');
       saveVariable('minor_version');
       saveVariable('compatible_brands');
       saveVariable('description');
       saveVariable('title');
           
       return returnObject;
    }
    
    function parseMediaStreamInfoString(streamInfoString) {
       var returnObject = {};
       
       var headerMatch = streamInfoString.match(/stream\s*\#(\d+)\:(\d+)(\((\w+)\))?\:/i);
       
       if (!headerMatch) {
          throw new Error("parseMediaStreamInfoString: Invalid stream info string! " + streamInfoString); 
       }
       
       returnObject['index'] = parseInt(headerMatch[2]);
       returnObject['name'] = headerMatch[4];
              
       // Don't you just love these long regexes?
       
       var videoMatch = streamInfoString.match(
       /video\:\s*([^\s]+)\s*(\((.+)\))?\s*\(([^\s]+)\s*\/\s*([^\s]+)\),\s*([^\(]+)(\((.+)\))?,(\s*((\d+)x(\d+))\s*(\[.+\])?)?,(\s*(\d+\s*kb\/s|N\/A),(\s*([\.0-9]+)\s*fps))?/i
       );
       var audioMatch = streamInfoString.match(
       /audio\:\s*([^\s]+)\s*(\((.+)\))?\s*\(([^\s]+)\s*\/\s*([^\s]+)\),\s*((\d+)\s*([a-z]+)),\s*([^\s^,]+),\s*([^\s^,]+),\s*(((\d+)\s*([a-z]+\s*\/\s*[a-z]+?))\s*(\((.+?)\))?)?/i  
       );
       var dataMatch = streamInfoString.match(/data:/i);

       if (videoMatch) {
          returnObject['type'] = 'video';
          
          returnObject['codec'] = videoMatch[1];
          returnObject['codec_option'] = videoMatch[3];
          returnObject['codec_name'] = videoMatch[4];
          
          returnObject['pixel_format'] = videoMatch[6];
          returnObject['pixel_format_option'] = videoMatch[8];
          
          returnObject['width'] = parseInt(videoMatch[11]);
          returnObject['height'] = parseInt(videoMatch[12]);
          
          returnObject['bitrate'] = videoMatch[15];
          returnObject['fps'] = parseFloat(videoMatch[17]);
       } else if (audioMatch) {
          returnObject['type'] = 'audio';
          
          returnObject['codec'] = audioMatch[1];
          returnObject['codec_option'] = audioMatch[3];
          returnObject['codec_name'] = audioMatch[4];
          
          returnObject['sample_rate'] = audioMatch[6];
          
          returnObject['channels'] = audioMatch[9];
          returnObject['decoder'] = audioMatch[10];
          
          returnObject['bitrate'] = audioMatch[12];
          returnObject['bitrate_option'] = audioMatch[16];
       } else if (dataMatch) {
          returnObject['type'] = 'data';
       }
       
       return returnObject;
    }
    
    function parseMetadataOutput(metadata, fileOutput) {
        var returnedMetadata = {};
        
        var metadataString = metadata;
        var inputRegex = /input \#(\d+),\s?([\w\s\,]+),\s?from/gi;
        
        var inputMatch = inputRegex.exec(metadataString)
        while (inputMatch) {
           var nextInputMatch = inputRegex.exec(metadataString);

           var inputString = utils.sliceStringByRegexMatches(metadataString,
                                     inputMatch, nextInputMatch);
           
           console.log(inputString);
           
           var metadataInfoRegex = /metadata:/i;
           
           var streamRegex = /stream\s*\#(\d+)\:(\d+)(\((\w+)\))?\:/ig;
            
           var metadataInfoMatch = metadataInfoRegex.exec(inputString);
           
           if (metadataInfoMatch) {
               // This is the metadata info for the whole
               // media file.  It's bordered either by a stream
               // definition or nothing.
               
               // We have to parse both the string as well as the file output
               // we get from running the metadata command.  The title and description
               // can have spaces, so we can't really parse the raw string, but the file output
               // doesn't have the encoding or creation time listed for some reason.
               
               var metadataInfoString = utils.sliceStringByRegexMatches(inputString,
                      metadataInfoMatch);
               var streamBorderMatch = streamRegex.exec(metadataInfoString);
               streamRegex.lastIndex = 0;
               
               metadataInfoString = utils.sliceStringByRegexMatches(metadataInfoString,
                 null, streamBorderMatch);
                 
               console.log(metadataInfoString);
               
               returnedMetadata['info'] = parseMediaMetadataInfoString(metadataInfoString);
               
               utils.extend(true, returnedMetadata['info'], parseMediaMetadataOutputFile(fileOutput));
           }
           
           returnedMetadata['streams'] = [];
           
           var streamMatch = streamRegex.exec(inputString);
           while (streamMatch) {
              var nextStreamMatch = streamRegex.exec(inputString);
              var metadataInfoMatch = metadataInfoRegex.exec(inputString);
              
              var streamInfoString = null;
              
              // Streams can be bordered either by the metadata
              // info area, or by another stream definition, or by the
              // end of the metadata string.
              
              if (!nextStreamMatch &&
                  !metadataInfoMatch) {
                 // Nothing after this stream definition area
                 streamInfoString = utils.sliceStringByRegexMatches(inputString, 
                                streamMatch);        
              } else {
                 if (nextStreamMatch &&
                     metadataInfoMatch) {
                    // Both are after this stream definition,
                    // so see which one is closer
                    if (metadataInfoMatch.index < nextStreamMatch.index &&
                        metadataInfoMatch.index > streamMatch.index) {
                       streamInfoString = utils.sliceStringByRegexMatches(
                           inputString, streamMatch, metadataInfoMatch
                       );
                    } else {
                       streamInfoString = utils.sliceStringByRegexMatches(
                           inputString, streamMatch, nextStreamMatch
                       );                        
                    }   
                 } else {
                    streamInfoString = utils.sliceStringByRegexMatches(
                        inputString, streamMatch, nextStreamMatch || metadataInfoMatch
                    );
                 }
              }
              
              console.log(streamInfoString);
              
              returnedMetadata['streams'].push(
                  parseMediaStreamInfoString(streamInfoString));
              
              streamMatch = nextStreamMatch;
           }
           
           inputMatch = nextInputMatch;
        }
        
        return returnedMetadata;
/*
ffmpeg version 2.2.1 
Copyright (c) 2000-2014 the FFmpeg developers  
built on Jun  9 2014 20:24:32 with emcc (Emscripten GCC-like replacement) 
1.12.0 (commit 6960d2296299e96d43e694806f5d35799ef8d39c)  
configuration: --cc=emcc --prefix=/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist --extra-cflags='-I/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/include -v' --enable-cross-compile --target-os=none --arch=x86_32 --cpu=generic --disable-ffplay --disable-ffprobe --disable-ffserver --disable-asm --disable-doc --disable-devices --disable-pthreads --disable-w32threads --disable-network --disable-hwaccels --disable-parsers --disable-bsfs --disable-debug --disable-protocols --disable-indevs --disable-outdevs --enable-protocol=file --enable-libvpx --enable-gpl --extra-libs='/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/lib/libx264.a /Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/lib/libvpx.a'  
libavutil      52. 66.100 / 52. 66.100  
libavcodec     55. 52.102 / 55. 52.102  
libavformat    55. 33.100 / 55. 33.100  
libavdevice    55. 10.100 / 55. 10.100  
libavfilter     4.  2.100 /  4.  2.100  
libswscale      2.  5.102 /  2.  5.102  
libswresample   0. 18.100 /  0. 18.100  
libpostproc    52.  3.100 / 52.  3.100
[h264 @ 0xee0820] Warning: not compiled with thread support, using thread emulation[aac @ 0xee8eb0] 
Warning: not compiled with thread support, using thread emulation

Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '11814676_10153463694786788_781424206_n.mp4':  
   Metadata:    
      major_brand     : isom    
      minor_version   : 512    
      compatible_brands: isomiso2avc1mp41    
      title           : 10153463693781788    
      encoder         : Lavf56.4.101  
      Duration: 00:01:39.85, 
      start: 0.114694, 
      bitrate: 268 kb/s    
   Stream #0:0(und): 
      Video: h264 (Constrained Baseline) (avc1 / 0x31637661), yuv420p, 400x222, 215 kb/s, 29.98 fps, 29.98 tbr, 14988 tbn, 59.95 tbc (default)    
      Metadata:      
         handler_name    : VideoHandler    
   Stream #0:1(und): 
      Audio: aac (mp4a / 0x6134706D), 44100 Hz, stereo, fltp, 48 kb/s (default)    
      Metadata:      
         handler_name    : SoundHandler
[libx264 @ 0xed8f80] Warning: not compiled with thread support, using thread emulation
[libx264 @ 0xed8f80] using cpu capabilities: none!
[libx264 @ 0xed8f80] profile High, level 1.3
[libx264 @ 0xed8f80] 264 - core 142 - H.264/MPEG-4 AVC codec - Copyright 2003-2014 - http://www.videolan.org/x264.html - options: cabac=1 ref=3 deblock=1:0:0 analyse=0x3:0x113 me=hex subme=7 psy=1 psy_rd=1.00:0.00 mixed_ref=1 me_range=16 chroma_me=1 trellis=1 8x8dct=1 cqm=0 deadzone=21,11 fast_pskip=1 chroma_qp_offset=-2 threads=1 lookahead_threads=1 sliced_threads=0 nr=0 decimate=1 interlaced=0 bluray_compat=0 constrained_intra=0 bframes=3 b_pyramid=2 b_adapt=1 b_bias=0 direct=1 weightb=1 open_gop=0 weightp=2 keyint=250 keyint_min=25 scenecut=40 intra_refresh=0 rc_lookahead=40 rc=crf mbtree=1 crf=23.0 qcomp=0.60 qpmin=0 qpmax=69 qpstep=4 ip_ratio=1.40 aq=1:1.00[aac @ 0xed9c50] The encoder 'aac' is experimental but experimental codecs are not enabled, add '-strict -2' if you want to use it.
*/   

/*
ffmpeg version 2.2.1 
Copyright (c) 2000-2014 the FFmpeg developers  
built on Jun  9 2014 20:24:32 with emcc (Emscripten GCC-like replacement) 
1.12.0 (commit 6960d2296299e96d43e694806f5d35799ef8d39c)  
configuration: --cc=emcc --prefix=/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist --extra-cflags='-I/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/include -v' --enable-cross-compile --target-os=none --arch=x86_32 --cpu=generic --disable-ffplay --disable-ffprobe --disable-ffserver --disable-asm --disable-doc --disable-devices --disable-pthreads --disable-w32threads --disable-network --disable-hwaccels --disable-parsers --disable-bsfs --disable-debug --disable-protocols --disable-indevs --disable-outdevs --enable-protocol=file --enable-libvpx --enable-gpl --extra-libs='/Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/lib/libx264.a /Users/bgrinstead/Sites/videoconverter.js/build/ffmpeg/../dist/lib/libvpx.a'  
libavutil      52. 66.100 / 52. 66.100  
libavcodec     55. 52.102 / 55. 52.102  
libavformat    55. 33.100 / 55. 33.100  
libavdevice    55. 10.100 / 55. 10.100  
libavfilter     4.  2.100 /  4.  2.100  
libswscale      2.  5.102 /  2.  5.102  
libswresample   0. 18.100 /  0. 18.100  
libpostproc    52.  3.100 / 52.  3.100
[h264 @ 0xee0850] Warning: not compiled with thread support, using thread emulation
[aac @ 0xed8d30] Warning: not compiled with thread support, using thread emulation
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'soccer_small.m4v':  
   Metadata:    
      major_brand     : M4V     
      minor_version   : 1    
      compatible_brands: M4V M4A mp42isom    
      creation_time   : 2012-07-02 05:15:16  
      Duration: 00:01:16.51, 
      start: 0.000000, 
      bitrate: 1709 kb/s    
      Stream #0:0(eng): 
         Video: h264 (Constrained Baseline) (avc1 / 0x31637661), yuv420p(tv, smpte170m), 640x360, 1602 kb/s, 29.97 fps, 29.97 tbr, 2997 tbn, 5994 tbc (default)    
         Metadata:      
            creation_time   : 2012-07-02 05:15:16      
            handler_name    : Apple Video Media Handler    
      Stream #0:1(eng): 
         Audio: aac (mp4a / 0x6134706D), 44100 Hz, stereo, fltp, 103 kb/s (default)    
         Metadata:      
            creation_time   : 2012-07-02 05:15:16      
            handler_name    : Apple Sound Media Handler
[libx264 @ 0xedd110] Warning: not compiled with thread support, using thread emulation
[libx264 @ 0xedd110] using cpu capabilities: none!
[libx264 @ 0xedd110] profile High, level 3.0
[libx264 @ 0xedd110] 264 - core 142 - H.264/MPEG-4 AVC codec - Copyright 2003-2014 - http://www.videolan.org/x264.html - options: cabac=1 ref=3 deblock=1:0:0 analyse=0x3:0x113 me=hex subme=7 psy=1 psy_rd=1.00:0.00 mixed_ref=1 me_range=16 chroma_me=1 trellis=1 8x8dct=1 cqm=0 deadzone=21,11 fast_pskip=1 chroma_qp_offset=-2 threads=1 lookahead_threads=1 sliced_threads=0 nr=0 decimate=1 interlaced=0 bluray_compat=0 constrained_intra=0 bframes=3 b_pyramid=2 b_adapt=1 b_bias=0 direct=1 weightb=1 open_gop=0 weightp=2 keyint=250 keyint_min=25 scenecut=40 intra_refresh=0 rc_lookahead=40 rc=crf mbtree=1 crf=23.0 qcomp=0.60 qpmin=0 qpmax=69 qpstep=4 ip_ratio=1.40 aq=1:1.00[aac @ 0xeddc60] The encoder 'aac' is experimental but experimental codecs are not enabled, add '-strict -2' if you want to use it.

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
                      
                      var result = getEventMessageDataResult(data);
                      
                      var fileModel = FileModel.fromArrayBuffer(result[0].data, result[0].name);
                      
                      fileModel.getText()
                      .then(function(text) {
                         var metadata = parseMetadataOutput(getEventMessageDataOutput(data),
                                    text); 
                        // console.log("TEXT?!", text);
                         resolve(metadata);
                      })
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

