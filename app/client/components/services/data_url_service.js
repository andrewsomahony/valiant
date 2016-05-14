'use strict';

var registerService = require('services/register');

var name = 'services.data_url';

registerService('factory', name, [require('services/base64_service'),
                                  require('services/promise'),
function(Base64Service, Promise) {
   function DataUrlService() {
      
   }
   
   var base64Separator = 'base64,';
   
   DataUrlService.getBase64Index = function(dataUrl) {
      return dataUrl.indexOf(base64Separator);
   }

   DataUrlService.isBase64 = function(dataUrl) {
      return -1 === this.getBase64Index(dataUrl) ? false : true
   }
   
   DataUrlService.getDataSubstring = function(dataUrl) {
      if (false === this.isBase64(dataUrl)) {
         return null;
      } else {
         return dataUrl.substring(this.getBase64Index(dataUrl) + base64Separator.length);
      }
   }
   
   DataUrlService.getFileType = function(dataUrl) {
      //Attempt to extract it from the base64 data
      var fileType = "";
      var dataSeparator = 'data:';

      var index = dataUrl.indexOf(dataSeparator);

      if (dataUrl.indexOf(dataSeparator) > -1 &&
            dataUrl.indexOf(';') > -1) {
         var dataString = dataUrl.split(';')[0];

         if (dataString.indexOf(':') > -1) {
            fileType = dataString.split(':')[1];
         }
      }
      
      return fileType;
   }

   DataUrlService.dataUrlToBlob = function(dataUrl, dataType) {
      if (false === this.isBase64(dataUrl)) {
         return null;
      }

      if (!dataType) {
         dataType = this.getFileType(dataUrl);
      }

      return new Blob([Base64Service.decodeIntoArrayBuffer(
         this.getDataSubstring(dataUrl))],
         {type: dataType});     
   }
   
   DataUrlService.dataUrlToImage = function(dataUrl) {
      var image = new Image();
      image.src = dataUrl;
      
      // Because we're using a dataUrl
      // we can just return the image
      // without waiting for onLoad
      
      // !!! What if there's an error?
      
      return image;
   }
   
   return DataUrlService;
}
])

module.exports = name;