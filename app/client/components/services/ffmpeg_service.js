'use strict';

var registerService = require('services/register');

var name = 'services.ffmpeg_service';

var utils = require('utils');

registerService('factory', name, [require('services/promise'),
                                  require('services/progress'),
                                  require('models/file'),
                                  require('services/error'),
                                  require('services/picture_service'),
                                  require('services/mime_service'),
function(Promise, ProgressService, FileModel,
ErrorService, PictureService, MimeService) {
    
    function FFMpegService() {
        
    }
    
    // Ok, so the way that it works is that only
    // one request can be using the web worker at
    // any given time.  I would like to have different
    // web workers for multiple requests, but I can't seem
    // to find a way to FULLY guarantee caching of the ffmpeg library
    // file, so we don't want to keep loading it over and over again.
    
    // Once a worker function gets the 'done' or 'error' messages,
    // it MUST MUST MUST call releaseWorker() right away, so then
    // if there's another function/request waiting, it can grab the worker
    // and get going.
    
    // reserveWorker is called automatically within getWorker(), either
    // when it's first created, or when it gets to use the worker.
    
    // The getWorker function also has an optional parameter, releaseOnCreation,
    // which, if set to true, automatically releases the worker for usage once
    // it's done loading.  This is incase I want to preload it before letting the
    // user use the features.
    
    var worker = null;
    var workerIsAvailable = true;
    
    function reserveWorker() {
       workerIsAvailable = false;
    }
    
    function releaseWorker() {
       workerIsAvailable = true;
    }

    function createWorkerMessage(messageType, data) {
       return {
          type: messageType,
          data: data
       };
    }
    
    function sendMessageToWorker(message) {
       worker.postMessage(message);
    }
    
    function sendCommandToWorker(command, file, data) {
       file = file || null;
       data = data || {};
       var messageData = utils.extend(true, {
          commandType: command,
          file: file
       }, data);
       
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
       
       var outputMatch = /output\s*\#\d+/i.exec(streamInfoString);
       
       streamInfoString = utils.sliceStringByRegexMatches(streamInfoString, null, outputMatch);
       
       console.log(streamInfoString);
       
       // Each stream also has some metadata attached
       // I'm not parsing this at the moment as it doesn't seem
       // to contain anything useful for what I need.
       
       var headerMatch = streamInfoString.match(/stream\s*\#(\d+)\:(\d+)(\((\w+)\))?\:/i);
       
       if (!headerMatch) {
          throw new Error("parseMediaStreamInfoString: Invalid stream info string! " + streamInfoString); 
       }
       
       returnObject['index'] = parseInt(headerMatch[2]);
       returnObject['name'] = headerMatch[4];
              
       // Don't you just love these long regexes?
       // This does rely on the information being presented
       // in relatively the same order, so I do need to watch our
       // if I ever recompile the ffmpeg Javascript library.
       
       // Alternatively, I could just parse this as CSV and extract
       // what I need...but that doesn't work, as some of the strings (pixel format)
       // are arbitrary and have nothing I can really match as a pattern, so I have to rely
       // on the order being the same regardless...
       
       var videoMatch = streamInfoString.match(
       /video\:\s*(([^\s^\,]+)\s*(\(([a-z0-9\s^\)]+?)\))?)(\s*\(([a-z0-9]+)\s*\/\s*([^\)]+)\))?,\s*([^\(]+?)(\((.+?)\))?,(\s*((\d+)x(\d+))\s*(\[(.+?)\])?)?(,\s*(\d+\s*kb\/s|N\/A))?(,\s*([a-z]+\s*\d+\:\d+\s*[a-z]+\s*\d+\:\d+))?\s*(,\s*([\.0-9]+)\s*fps)?/i
       );
       var audioMatch = streamInfoString.match(
       /audio\:\s*(([^\s^\,]+)(\s*\(([a-z0-9]+?)\))?)(\s*\(([a-z0-9]+)\s*\/\s*([^\)]+)\))?(,\s*((\d+)\s*([a-z]+)))?(,\s*([^\s^,]+))?(\s*,\s*([^\s^,]+)\s*(\(([^)]+)\))?)?(,\s*((\d+)\s*([a-z]+\s*\/\s*[a-z]+?))\s*(\((.+?)\))?)?/i  
       );
       var dataMatch = streamInfoString.match(
       /data\:\s*([^\s]+)\s*(\((.+)\))?\s*\(([^\s]+)\s*\/\s*([^\s]+)\)/i
       );
       
       var metadataMatch = streamInfoString.match(/metadata\s*\:/i);
       var metadataString = "";

       if (metadataMatch) {
          metadataString = utils.sliceStringByRegexMatches(streamInfoString, metadataMatch);    
       }

       if (videoMatch) {
          returnObject['type'] = 'video';
          returnObject['metadata'] = {};
          
          returnObject['codec'] = videoMatch[2];
          returnObject['codec_option'] = videoMatch[4];
          returnObject['codec_name'] = videoMatch[6];
          
          returnObject['pixel_format'] = videoMatch[8];
          returnObject['pixel_format_option'] = videoMatch[10];
          
          returnObject['width'] = parseInt(videoMatch[13]);
          returnObject['height'] = parseInt(videoMatch[14]);

          returnObject['bitrate'] = videoMatch[18];
          
          returnObject['ratios'] = videoMatch[16] || videoMatch[20];
          
          returnObject['fps'] = parseFloat(videoMatch[22]);
          
          if (metadataString) {
             var rotationMatch = metadataString.match(/rotate\s*\:\s*(\d+)/i)
             if (rotationMatch) {
                returnObject['metadata']['rotation'] = parseInt(rotationMatch[1]);
             }
          }
       } else if (audioMatch) {
          returnObject['type'] = 'audio';
          returnObject['metadata'] = {};
          
          returnObject['codec'] = audioMatch[2];
          returnObject['codec_option'] = audioMatch[4];
          returnObject['codec_name'] = audioMatch[6];
          
          returnObject['sample_rate'] = audioMatch[9];
          
          returnObject['channels'] = audioMatch[13];
          returnObject['decoder'] = audioMatch[15];
          
          returnObject['bitrate'] = audioMatch[19];
          returnObject['bitrate_option'] = audioMatch[23];
       } else if (dataMatch) {
          returnObject['type'] = 'data';
          returnObject['metadata'] = {};
          
          returnObject['codec'] = dataMatch[1];
          returnObject['codec_option'] = dataMatch[3];
          returnObject['codec_name'] = dataMatch[4];
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
               streamRegex.lastIndex = 0; // We're gonna re-use this regex, so reset it.
               
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
              
              returnedMetadata['streams'].push(
                  parseMediaStreamInfoString(streamInfoString));
              
              streamMatch = nextStreamMatch;
           }
           
           inputMatch = nextInputMatch;
        }
        
        return returnedMetadata;   
    }
    
    FFMpegService.convertVideoToHTML5 = function(video) {
       return Promise(function(resolve, reject, notify) {
          FFMpegService.getWorker()
          .then(function() {
             fileModelToFFMpegFile(video.file_model)
             .then(function(file) {
                bindWorkerMessageHandler(function(event) {
                   var message = getEventMessage(event);
                   var data = getEventMessageData(message);
                   
                   if ('start' === message.type) {
                      
                   } else if ('output' === message.type) {
                  //    notify(ProgressService(50, 100));
                      console.log(getEventMessageDataResult(data));
                   } else if ('error' === message.type) {
                      releaseWorker();
                      reject(ErrorService.localError(getEventMessageDataResult(data)));
                   } else if ('done' === message.type) {
                      releaseWorker();
                      
                      var result = getEventMessageDataResult(data);
                      var output = getEventMessageDataOutput(data);
                      
                      var fileModel = FileModel.fromArrayBuffer(result[0].data,
                      result[0].name, MimeService.getMimeTypeFromFilename(result[0].name));
                      
                      // We need to parse the metadata here.
                      // Maybe we can do a second metadata call, I'm just
                      // worried about speed.
                      
                      resolve(fileModel);  
                   }
                });
                
                sendCommandToWorker('convert_to_html5', file, {canRemoveAudio: true});
             })
             .catch(function(error) {
                reject(error);
             })
          })
          .catch(function(error) {
             reject(error);
          })
       });
    }
    
    FFMpegService.getVideoThumbnail = function(video) {
        return Promise(function(resolve, reject, notify) {
           if (!video.getDuration()) {
              reject(ErrorService.localError("FFmpegService.getVideoThumbnail: Video does not have a duration!"));
           } else {
              FFMpegService.getWorker()
              .then(function() {
                 fileModelToFFMpegFile(video.file_model)
                 .then(function(file) {
                    bindWorkerMessageHandler(function(event) {
                       var message = getEventMessage(event);
                       var data = getEventMessageData(message); 
                        
                       if ('start' === message.type) {
                                    
                       } else if ('output' === message.type) {
                           console.log(getEventMessageDataResult(data));
                       } else if ('error' === message.type) {
                          releaseWorker();
                          reject(ErrorService.localError(
                             getEventMessageDataResult(data)
                          ));
                       } else if ('done' === message.type) {
                          releaseWorker();
                           
                          var result = getEventMessageDataResult(data);
                                                      
                          var fileModel = FileModel.fromArrayBuffer(result[0].data, 
                              result[0].name, MimeService.getMimeTypeFromFilename(result[0].name));
                           
                          PictureService.getPictureFromFileModel(fileModel)
                          .then(function(picture) {
                             resolve(picture);
                          })
                          .catch(function(error) {
                             reject(error);
                          })
                       }
                    });
                    
                    // Why do we need to optionally rotate the thumbnail?
                    // Well, videos sometimes have rotation data in their video stream,
                    // which our version of ffmpeg ignores when doing thumbnails.  Therefore,
                    // we never get any EXIF data that tells us to rotate, so we have to manually
                    // do it within the thumbnail command by rotating the input stream.
                     
                    sendCommandToWorker('get_thumbnail', file, {rotation: video.getRotation(), position: video.getDuration() / 2});
                 })  
                 .catch(function(error) {
                    reject(error);
                 })  
              })
              .catch(function(error) {
                 reject(error);    
              });
           }
        });  
    }
    
    FFMpegService.getVideoFileModelMetadata = function(fileModel) {
       return Promise(function(resolve, reject, notify) {
          FFMpegService.getWorker()
          .then(function() {
             fileModelToFFMpegFile(fileModel)
             .then(function(file) {
                bindWorkerMessageHandler(function(event) {
                   var message = getEventMessage(event);
                   var data = getEventMessageData(message);
                
                   if ('start' === message.type) {
                    
                   } else if ('output' === message.type) {
                   } else if ('error' === message.type) {
                      releaseWorker();
                      reject(ErrorService.localError(
                         getEventMessageDataResult(data)
                      ));
                   } else if ('done' === message.type) {
                      releaseWorker();
                      //console.log("FULL OUTPUT", getEventMessageDataOutput(data));
                      //console.log("RESULT", getEventMessageDataResult(data));
                      
                      var result = getEventMessageDataResult(data);
                      
                      var fileModel = FileModel.fromArrayBuffer(result[0].data, result[0].name);
                      
                      fileModel.getText()
                      .then(function(fileText) {
                        // console.log("TEXT?!", text);
                         resolve(parseMetadataOutput(getEventMessageDataOutput(data),
                                    fileText));
                      });
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
    
    FFMpegService.waitForWorker = function() {
       // Is there a better way to do this?
       return Promise(function(resolve, reject, notify) {
          var interval = setInterval(function() {
             if (workerIsAvailable) {
                reserveWorker();
                clearInterval(interval);
                resolve();
             }
          }, 100);
       });
    }
    
    FFMpegService.getWorker = function(releaseOnCreation) {
       releaseOnCreation = true === utils.isUndefinedOrNull(releaseOnCreation) ? false : releaseOnCreation;
       
       return Promise(function(resolve, reject, notify) {
          if (worker) {
             FFMpegService.waitForWorker()
             .then(function() {
                resolve();
             })
          } else {
             reserveWorker();
             worker = new Worker('/scripts/ffmpeg_util.js');

             bindWorkerMessageHandler(function(event) {
                var message = getEventMessage(event);
            
                if ('ready' === message.type) {
                   if (true === releaseOnCreation) {
                      releaseWorker();
                   }
                   resolve();
                }
             });          
          }
       });
    }
 
    return FFMpegService;
    
}]);

module.exports = name;

