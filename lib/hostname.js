'use strict';

var path = require('path');

module.exports = hostname;
module.exports.getHostName = getHostName;
module.exports.getHostNameWithoutPort = getHostNameWithoutPort;
module.exports.constructUrl = constructUrl;

var hostName = null;
var isSecure = false;

function hostname() {
   return function(request, result, next) {
      if (request && request.headers) {
         hostName = request.headers.host;
         isSecure = request.secure;
      } else {
         hostName = null;
         isSecure = false;
      }
      next();
   }
}

function getHostName() {
   return hostName;
}

function getHostNameWithoutPort() {
   var hostname = getHostName();
   
   return hostname.split(':')[0];
}

function constructUrl(pathString, paramString, protocol) {
   protocol = protocol || (isSecure ? "https" : "http");
   pathString = pathString || "";
   paramString = paramString || "";
   
   return protocol + "://" + path.join(getHostName(), pathString, paramString);
}