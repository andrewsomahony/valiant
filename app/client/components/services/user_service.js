'use strict';

var registerService = require('services/register');

var name = 'services.user_service';

registerService('factory', name, [
                                    require('services/facebook_service'),
                                    require('services/promise'),
                                    require('services/http_service'),
                                    require('models/user'),
                                    require('services/api_url'),
function(FacebookService, Promise, HttpService, UserModel, ApiUrlService) {    
    var currentUser = null;
    
    var currentUnverifiedUser = null;
    
    function UserService() {
        
    }
    
    UserService.dataResolverFn = function(state, params) {
        return Promise(function(resolve, reject, notify) {
            resolve({});
        });
    }
    
    UserService.isLoggedIn = function() {
        return null !== currentUser;
    }
    
    /*
    UserService.loginToFacebook = function() {
        return Promise(function(resolve, reject, notify) {
            console.log("Is this happening?");
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
        
        return Promise(function(resolve, reject, notify) {
            resolve({});
        });
    }
    
    UserService.disconnectFromFacebook = function() {
        // Will make an API call to the server to disconnect
        // the user account from Facebook.
        
        return Promise(function(resolve, reject, notify) {
            resolve({});
        });
    }*/
    
    UserService.getCurrentUser = function() {
        return currentUser;
    }
    
    UserService.getCurrentUnverifiedUser = function() {
        return currentUnverifiedUser;
    }
    
    UserService.login = function(credentials) {
        return Promise(function(resolve, reject, notify) {
            HttpService.post(ApiUrlService('Login', false), null, credentials)
            .then(function(userData) {
                currentUser = new UserModel(userData.data, true);
                currentUnverifiedUser = null;
                
                resolve();
            })
            .catch(function(error) {
                currentUser = null;
                
                if (403 === error.code) {
                    currentUnverifiedUser = new UserModel({email: credentials.email});
                } else {
                    currentUnverifiedUser = null;
                }
                
                reject(error);
            });
        });
    }
    
    UserService.logout = function() {
        if (false === this.isLoggedIn()) {
            throw new Error("Trying to log out when not logged in!");
        }
        
        
    }
    
    UserService.registerUser = function(user) {
        // Convert the object to a model
        return Promise(function(resolve, reject, notify) {
            HttpService.post(ApiUrlService([{name: 'User'}, {name: 'Register'}]), 
            null, {
                    user: user.toObject(true)
                  })
            .then(function() {
                currentUser = null;
                currentUnverifiedUser = user;
                resolve();
            })
            .catch(function(error) {
                reject(error);
            });
        });
    }
    
    return UserService;
}
]);

module.exports = name;