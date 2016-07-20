'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.api_url';

registerService('factory', name, [function() {
   var api = {
      'User': {
         url: "users",
         sub_api: {
            'EmailAvailable': {
               url: 'email_available'  
            },
            'Register': {
               url: "register",
               sub_api: {
                   'ResendEmail': {
                       url: 'resend_email'
                   }
               }
            },
            'ChangeEmail': {
               url: "change_email",
               sub_api: {
                   'ResendEmail': {
                       url: 'resend'
                   },
                   'Cancel': {
                       url: 'cancel'
                   }
               }  
            },
            'ChangePassword': {
              url: "change_password"  
            },
            'Me': {
               url: "me"
            },
            'ForgotPassword': {
                url: "forgot_password",
                sub_api: {
                    'ResetPassword': {
                        url: "reset"
                    }
                }
            }
         },
         paramArray: {
            userId: ""
         }
      },
      'S3': {
          url: "s3",
          sub_api: {
              'SignedUrl': {
                  url: "signed_url"
              }
          }
      },
      'Login': {
         url: "login",
         apiUrlPrefix: false
      },
      'Logout': {
         url: "logout",
         apiUrlPrefix: false
      },
      'Question': {
         url: "question",
         sub_api: {
            'Ask': {
               url: "ask"
            },
            'Comment': {
               url: "comment"
            }
         },
         paramArray: {
            questionId: ""
         }
      },
      'Workout': {
         url: "workout",
         sub_api: {
            'New': {
               url: "new"
            }
         },
         paramArray: {
            workoutId: ""
         }
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

   ApiUrlService.getObjectUrl = function(name, id) {
      return ApiUrlService([
          {
              name: name,
              paramArray: [id]
          }
       ]);
   }
   
   return ApiUrlService;
}]);

module.exports = name;