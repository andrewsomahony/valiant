'use strict';

var registerService = require('services/register');

var name = 'services.api_url';

registerService('factory', name, [function() {
   
   var api = {
      'User': {
         url: "users",
         sub_api: {
            
         }
      }
   };
   
   function ApiUrlService(resources) {
      var urlPrefix = "/api"; 
      var slash = "/";  
      var trailingSlash = "/";
      
      var returnUrl = "";
      
      if ('string' === typeof resources) {
         resources = [{
            name: resources,
            paramArray: []
         }];
      }
      
      returnUrl += urlPrefix + slash;
      
      var apiObject = null;
      resources.forEach(function(resourceObject, index) {
         if (!api[resourceObject.name]) {
            throw new Error("ApiUrlService: unknown resource " + resourceObject.name + "!");
         }
         
         if (null === apiObject) {
            apiObject = api[resourceObject.name];            
         } else {
            if (!apiObject.sub_api ||
                !apiObject.sub_api[resourceObject.name]) {
                throw new Error("ApiUrlService: unknown sub-resource (" + resourceObject.name + ")!");
            }
            
            apiObject = apiObject.sub_api[resourceObject.name];
         }
         
         returnUrl += apiObject.url + trailingSlash;

         resourceObject.paramArray.forEach(function(paramName) {
            returnUrl += paramName + trailingSlash;
         })
      });
      
      return returnUrl;
   }
   
   return ApiUrlService;
}]);

module.exports = name;