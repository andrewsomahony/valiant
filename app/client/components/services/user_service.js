'use strict';

var registerService = require('services/register');

var name = 'services.user_service';

registerService('factory', name, [
                                    require('services/facebook_service'),
                                    require('services/promise'),
function(FacebookService, PromiseService) {
    var isLoggedIn = false;
    
    function UserService() {
        
    }
    
    UserService.dataResolverFn = function(state, params) {
        return PromiseService(function(resolve, reject, notify) {
            isLoggedIn = true;
            resolve({});
        });
    }
    
    UserService.isLoggedIn = function() {
        return isLoggedIn;
    }
    
    UserService.loginToFacebook = function() {
        return PromiseService(function(resolve, reject, notify) {
            console.log("Is this happening?");
            isLoggedIn = true;
            resolve({});
        });        
    }
    
    UserService.connectToFacebook = function() {
        // Will grab the userId from FacebookService
        // and make an API call.
        
        // If the call returns that the user doesn't exist,
        // then we throw an error and it will redirect to
        // the registration page, with the user information
        // filled in.
        
        // If the call returns that the user does exist,
        // then we simply proceed as normal.
        
        return PromiseService(function(resolve, reject, notify) {
            isLoggedIn = true;
            resolve({});
        });
    }
    
    UserService.disconnectFromFacebook = function() {
        // Will make an API call to the server to disconnect
        // the user account from Facebook.
        
        return PromiseService(function(resolve, reject, notify) {
            isLoggedIn = false;
            resolve({});
        });
    }
    
    return UserService;
}
]);

module.exports = name;