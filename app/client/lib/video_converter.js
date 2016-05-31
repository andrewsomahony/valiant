'use strict';

module.exports = function(self) {
   function createMessage(message, data) {
      if (!message) {
         throw new Error("video_converter.createMessage: Missing message type!");
      }
      
      data = data || {};
      return {
         message: message,
         data: data
      };
   }
   
   self.importScripts("/scripts/ffmpeg-all-codecs.js");

   self.addEventListener("message", function(event) {
      console.log("WEB WORKER MESSAGE FROM MAIN THREAD", event);
   });
   
   self.postMessage(createMessage("ready"));
}