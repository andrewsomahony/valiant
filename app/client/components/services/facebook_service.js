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
    
    var loginStatus = "";
    
    var profile = {};
    
    function FacebookService() {
        this.setIsReady(false);
    }
    
    FacebookService.dataResolverFn = function(state, params) {
        return PromiseService(function(resolve, reject, notify) {
            resolve({});
        })
    }
            
    FacebookService.parseLoginStatusResponse = function(response) {
        loginStatus = response.status;
        userId = null;

        if ('connected' === response.status) {
            if (response.authResponse &&
                response.authResponse.userID) {
                userId = response.authResponse.userID;         
            }                    
        }        
    }            
            
    FacebookService.login = function(permissionsArray) {
        permissionsArray = permissionsArray || [];
        var returnScopes = permissionsArray.length > 0 ? true : false;
        
        return PromiseService(function(resolve, reject, notify) {
           Facebook.login(function() {},
           {
               scope: permissionsArray.join(","),
               return_scopes: returnScopes,
               auth_type: 'rerequest'
           })
           .then(function(response) {               
               FacebookService.parseLoginStatusResponse(response);

               if ('connected' === loginStatus) {
                   resolve({});
               } else if ('not_authorized' === loginStatus) {
                   ErrorService.rejectLocalDeferred("Permissions not authorized, cannot connect with Facebook", reject);
               } else {
                   ErrorService.rejectLocalDeferred("Cannot connect with Facebook", reject);
               }
           });
        });
    }
    
    FacebookService.logout = function() {
        return PromiseService(function(resolve, reject, notify) {
            Facebook.logout(function() {})
            .then(function(response) {
                loginStatus = null;
                userId = null;
                
                resolve({});
            });
        });
    }
    
    FacebookService.getLoginStatus = function() {
        return PromiseService(function(resolve, reject, notify) {
            Facebook.getLoginStatus(function() {})
            .then(function(response) {  
                FacebookService.setIsReady(true); 
                FacebookService.parseLoginStatusResponse(response);                     

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
                        function() {})
            .then(function(response) {
                profile = utils.extend(true, {}, response);
                resolve({});
            });
        })
    }
    
    FacebookService.isLoggedIn = function() {
        if ('connected' === loginStatus &&
            userId) {
            return true;
        } else {
            return false;    
        }
    }
    
    FacebookService.getUserId = function() {
        return userId;
    }
    
    FacebookService.isReady = function() {
        return isReady;
    }
    
    FacebookService.setIsReady = function(ir) {
        isReady = ir;
    }
    
    return FacebookService;
}]);

module.exports = name;