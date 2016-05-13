'use strict';

var registerService = require('services/register');

var name = 'services.data_url';

registerService('factory', name, [require('services/base64_service'),
function(Base64Service) {
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

   DataUrlService.dataUrlToBlob = function(dataUrl, dataType) {

      if (false === this.isBase64(dataUrl)) {
         return null;
      }

      if (!dataType) {
         //Attempt to extract it from the base64 data
         var dataSeparator = 'data:';

         var index = dataUrl.indexOf(dataSeparator);

         if (dataUrl.indexOf(dataSeparator) > -1 &&
             dataUrl.indexOf(';') > -1) {
            var dataString = dataUrl.split(';')[0];

            if (dataString.indexOf(':') > -1)
            {
               dataType = dataString.split(':')[1];
            }
         }
      }

      return new Blob([Base64Service.decodeIntoArrayBuffer(
         this.getDataSubstring(dataUrl))],
         {type: dataType});     
   }
   
   return DataUrlService;
}
])

module.exports = name;