'use strict';

importScripts("/scripts/lib/ffmpeg-all-codecs.js");

var outputFileName = "ffmpeg_util_temp_file.mp4";
var totalMemory = 83886080;

function sendMessage(type, data) {
   if (!type) {
      throw new Error("video_converter.sendMessage: Missing message type!");
   }
   
   data = data || {};
   postMessage({
      type: type,
      data: data
   });
}

function sendErrorMessage(errorMessage) {
   sendMessage('error', {result: errorMessage});
}

function sendOutputMessage(message) {
   sendMessage('output', {result: message});
}

function getEventMessage(event) {
   return event.data;
}

function runCommand(file, args) {
   var printedData = [];
    
   file = file || null;
   args = args || [];
    
   var printFn = function(text) {
      printedData.push(text);
      sendOutputMessage(text);
   }
    
   var Module = {
       fileData: null !== file ? file.data : null,
       fileName: null !== file ? file.name : null,
       arguments: args,
       print: printFn,
       printErr: printFn,
       TOTAL_MEMORY: totalMemory//83886080
       //TOTAL_MEMORY: 268435456
   };
   
   sendMessage('start');
        
   try {
      var result = ffmpeg_run(Module);
      sendMessage('done', {
         result: result,
         full_output: printedData.join("")
      });   
   } catch (e) {
      sendErrorMessage(e.message);
   }
}

onmessage = function(event) {
   console.log("WEB WORKER MESSAGE FROM MAIN THREAD", event);
   
   var message = getEventMessage(event);
   
   if ('command' === message.type) {
      if (!message.data) {
         sendErrorMessage("No data for command message!");
      } else {
         var commandType = message.data.commandType;
         var file = message.data.file;
         
         var args = null;
         
         if ('get_metadata' === commandType) {
            if (!file) {
               sendErrorMessage("ffmpeg_util.get_metadata: command needs a file!");
            } else {
               args = ["-i", file.name, "-f", "ffmetadata", "metadata.txt"];
            }
         } else if ('get_thumbnail' === commandType) {
            if (!file) {
               sendErrorMessage("ffmpeg_util.get_thumbnails: command needs a file!");  
            } else {
               var position = message.data.position;
               
               /*
                           args = ["-ss", "00:00:03.010",
                    "-i", message.file.name,
                    //"-vf", "select='not(mod(n,60))',setpts='N/(30*TB)'",
                    "-s", "320x200",
                    "-vframes", "1",
                    "-v", "verbose",
                    "-an", // Don't need audio
                    "thumb%d.jpeg"];
               */
               
               args = ["-ss", "" + position,
                       "-i", file.name,
                       "-s", "320x200",
                       "-v", "verbose",
                       "-vframes", "1",
                       "-an",
                       "thumb%d.jpeg"];
            }
            
         } else if ('convert_to_html5' === commandType) {
            var canRemoveAudio = message.data.canRemoveAudio; 
         } else {
            sendErrorMessage("ffmpeg_util: Unknown command " + commandType);
         }
         
         if (args) {
            runCommand(file, args);
         }
      }
   }
}

sendMessage("ready");