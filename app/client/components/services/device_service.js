'use strict';

var registerService = require('services/register');

var name = 'services.device_service';

var deviceDetector = require('device-detector');

registerService('factory', name, [
function() {
   var parsedInfo = deviceDetector.parse();
   
   function DeviceDetector() {
      
   }
   
   DeviceDetector.isDesktop = function() {
      return "Desktop" === parsedInfo.type;
   }
   
   DeviceDetector.isPhone = function() {
      return "Mobile" === parsedInfo.type;
   }
   
   DeviceDetector.isTablet = function() {
      return "Tablet" === parsedInfo.type;
   }
   
   DeviceDetector.isIE = function() {
      return "MSIE" === parsedInfo.browser ||
             "IEMobile" === parsedInfo.browser;
   }
   
   DeviceDetector.parse = function() {
      return parsedInfo;
   }
   
   return DeviceDetector;
}   
]);

module.exports = name;