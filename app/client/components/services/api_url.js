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
               url: "register",
               sub_api: {
                   'EmailAvailable': {
                       url: 'email_available'
                   }
               }
            },
            'Reverify': {
               url: "resend_email",
               paramArray: {
                  emailToken: ""
               }
            },
            'Me': {
               url: "me"
            }
         },
         paramArray: {
            userId: ""
         }
      },
      'Login': {
         url: "login",
         apiUrlPrefix: false
      },
      'Logout': {
         url: "logout",
         apiUrlPrefix: false
      }
   };

   function ApiUrlService(resources) {
      var slash = "/";  
      var trailingSlash = "/";
      
      var returnUrl = "";
      
      if ('string' === typeof resources) {
         resources = [{
            name: resources,
            paramArray: []
         }];
      } else if (true === utils.isPlainObject(resources)) {
         resources = [resources];
      }
  
      var apiObject = null;
      resources.forEach(function(resourceObject, index) {
         if (null === apiObject) {
            if (!api[resourceObject.name]) {
               throw new Error("ApiUrlService: unknown resource " + resourceObject.name + "!");
            }
            apiObject = api[resourceObject.name];    
            
            var apiPrefix = true === utils.isUndefinedOrNull(apiObject.apiUrlPrefix) ? true
                         : apiObject.apiUrlPrefix;
            
            returnUrl += (apiPrefix ? "/api" : "") + slash;    
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