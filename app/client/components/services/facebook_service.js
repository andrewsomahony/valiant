'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.facebook_service';

registerService('factory', name, ['Facebook',
                                  require('services/promise'),
                                  require('services/error'),
function(Facebook, PromiseService, ErrorService) {
    var isReady = false;
    
    var isLoggedIn = false;
    var userId = null;
    
    var profile = {};
    
    function FacebookService() {
        
    }
    
    FacebookService.login = function(permissionsArray) {
        permissionsArray = permissionsArray || [];
        var returnScopes = permissionsArray.length > 0 ? true : false;
        
        return PromiseService(function(resolve, reject, notify) {
           Facebook.login(function(response) {
               console.log(response);
               if ('connected' === response.status) {
                   isLoggedIn = true;
                   userId = response.authResponse.userID;
                   
                   resolve({});
                   
               } else if ('not_authorized' === response.status) {
                   isLoggedIn = false;
                   userId = null;
                   
                   ErrorService.rejectLocalDeferred("Facebook not authorized, cannot connect with Facebook", reject);
               } else {
                   isLoggedIn = false;
                   userId = null;
                   
                   ErrorService.rejectLocalDeferred("Facebook not authorized, cannot connect with Facebook", reject);
               }
           },
           {
               scope: permissionsArray.join(","),
               return_scopes: returnScopes
           }
           );
        });
    }
    
    FacebookService.getLoginStatus = function() {
        return PromiseService(function(resolve, reject, notify) {
            Facebook.getLoginStatus(function(response) {
               console.log(response);
               if ('connected' === response.status) {
                   isLoggedIn = true;
                   userId = response.authResponse.userID;
               } else if ('not_authorized' === response.status) {
                   isLoggedIn = false;
                   userId = null;
               } else {
                   isLoggedIn = false;
                   userId = null;
               }

                resolve({});
            });
        });
    }
    
    FacebookService.getProfile = function() {
        return PromiseService(function(resolve, reject, notify) {
            Facebook.api('/me', 
                        {
                            fields: 'email,picture.type(large),last_name,first_name,middle_name,name',
                        },
            function(response) {
                console.log("PROFILE: ", response);
            });
        })
    }
    
    FacebookService.isLoggedIn = function() {
        return isLoggedIn;
    }
    
    FacebookService.getUserId = function() {
        return userId;
    }

/*
    $scope.loginWithFacebook = function() {
        Facebook.login(function(response) {
            console.log(response);
        });      
    }

    $scope.me = function() {
        Facebook.api('/me', function(response) {
            console.log("FACEBOOK ME: ", response);
            //$scope.user = response;
        });
    };

    $scope.$watch(function() {
        return Facebook.isReady();
    }, function(newVal) {
        $scope.facebookIsReady = true;
    });
*/
    
    return FacebookService;
}]);

module.exports = name;