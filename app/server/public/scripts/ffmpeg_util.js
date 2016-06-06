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