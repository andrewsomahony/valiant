'use strict';

importScripts("/scripts/lib/ffmpeg-all-codecs.js");

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

onmessage = function(event) {
   console.log("WEB WORKER MESSAGE FROM MAIN THREAD", event);
}

sendMessage("ready");