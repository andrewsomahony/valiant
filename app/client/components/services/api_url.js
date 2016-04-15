'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.api_url';

registerService('factory', name, [function() {
   
   var api = {
      'User': {
         url: "users",
         sub_api: {
            'Register': {
               url: "register"
            },
            'Reverify': {
               url: "resend_email"
            }
         }
      },
      'Login': {
         url: "login"
      }
   };
   
   function ApiUrlService(resources, isPartOfApi) {
      isPartOfApi = true === utils.isUndefinedOrNull(isPartOfApi) ? true : isPartOfApi;
      
      var urlPrefix = true === isPartOfApi ? "/api" : ""; 
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
         if (null === apiObject) {
            if (!api[resourceObject.name]) {
               throw new Error("ApiUrlService: unknown resource " + resourceObject.name + "!");
            }
            apiObject = api[resourceObject.name];            
         } else {
            if (!apiObject.sub_api ||
                !apiObject.sub_api[resourceObject.name]) {
                throw new Error("ApiUrlService: unknown sub-resource (" + resourceObject.name + ")!");
            }
            
            apiObject = apiObject.sub_api[resourceObject.name];
         }
         
         returnUrl += apiObject.url + trailingSlash;

         if (resourceObject.paramArray) {
            resourceObject.paramArray.forEach(function(paramName) {
               returnUrl += paramName + trailingSlash;
            });
         }
      });
      
      return returnUrl;
   }
   
   return ApiUrlService;
}]);

module.exports = name;