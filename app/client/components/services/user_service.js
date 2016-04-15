'use strict';

var registerService = require('services/register');

var name = 'services.user_service';

registerService('factory', name, [
                                    require('services/facebook_service'),
                                    require('services/promise'),
                                    require('services/http_service'),
                                    require('models/user'),
                                    require('services/api_url'),
                                    require('services/error'),
function(FacebookService, Promise, HttpService, UserModel, ApiUrlService,
ErrorService) {    
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
                if (202 === userData.status) {
                    currentUnverifiedUser = new UserModel(userData.data, true);
                    console.log(currentUnverifiedUser);
                    currentUser = null;
                } else {
                    currentUser = new UserModel(userData.data, true);
                    currentUnverifiedUser = null;
                }
                
                resolve({status: userData.status});
            })
            .catch(function(error) {
                currentUser = null;
                currentUnverifiedUser = null;
                
                reject(error);
            });
        });
    }
    
    UserService.logout = function() {
        if (false === this.isLoggedIn()) {
            throw new Error("Trying to log out when not logged in!");
        }
        
        
    }
    
    UserService.resendVerificationEmail = function() {
        return Promise(function(resolve, reject, notify) {
            var u = UserService.getCurrentUnverifiedUser();
            
            if (!u) {
                reject(ErrorService.localError("Missing unverified user!"));
            } else {
                HttpService.get(ApiUrlService([
                    {
                        name: 'User'
                    },
                    {
                        name: 'Reverify',
                        paramArray: [u.email_token]
                    }
                ]))
                .then(function() {
                    resolve();
                })
                .catch(function(error) {
                    reject(error);
                })
            }         
        });

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