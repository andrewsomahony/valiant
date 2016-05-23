'use strict';

var registerService = require('services/register');

var name = 'services.mime_service';

registerService('factory', name, [
function() {
   function MimeService() {
      
   }
   
   MimeService.isValidMimeType = function(mimeType) {
      var mimeTypeRegex = /[\w\*]+\/[\w\*]+/i;
      
      if (!mimeType.match(mimeTypeRegex)) {
         return false;
      } else {
         return true;
      }
   }
   
   MimeService.checkMimeType = function(mimeType, acceptableMimeType) {
      // see: http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex

      if (!MimeService.isValidMimeType(mimeType)) {
         return false;
      } else {
         acceptableMimeType = acceptableMimeType.replace( /[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&" )
                           .replace( /,/g, "|" )
                           .replace( "\/*", "/.*" );
      
         var regex = new RegExp( ".?(" + acceptableMimeType + ")$", "i" );
         
         if (!mimeType.match(regex)) {
            return false;
         } else {
            return true;
         }
      }
   }
   
   MimeService.isBaseMimeType = function(mimeType, baseType) {
      var regex = new RegExp(".?(" + baseType + ")\/.*", "i");
      
      if (!mimeType.match(regex)) {
         return false;
      } else {
         return true;
      }
   }
   
   return MimeService;
}
])

module.exports = name;