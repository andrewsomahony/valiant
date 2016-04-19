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
    var currentRequestedUser = null;
    
    function UserService() {
        
    }
    
    UserService.dataResolverFn = function(state, params) {
        return Promise(function(resolve, reject, notify) {
            if ('main.page.user.default' === state) {
                HttpService.get(ApiUrlService({name: 'User', paramArray: [params.userId]}))
                .then(function(user) {
                   currentRequestedUser = new UserModel(user.data, true);
                    resolve({});    
                })
                .catch(function(error) {
                    reject(error);
                });
            } else {
                resolve({});
            }
            
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
    
    UserService.getCurrentRequestedUser = function() {
        return currentRequestedUser;
    }
    
    UserService.login = function(credentials) {
        return Promise(function(resolve, reject, notify) {
            HttpService.post(ApiUrlService('Login'), null, credentials)
            .then(function(userData) {
                if (202 === userData.status) {
                    currentUnverifiedUser = new UserModel(userData.data, true);
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
        return Promise(function(resolve, reject, notify) {
            if (false === UserService.isLoggedIn()) {
                reject(ErrorService.localError("Not logged in!"));
            } else {
                HttpService.post(ApiUrlService('Logout'))
                .then(function() {
                    currentUser = null;
                    currentUnverifiedUser = null;
                    resolve();
                })
                .catch(function(error) {
                    reject(error);
                })
            }       
        });
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
    
    UserService.getUser = function(userId) {
        return Promise(function(resolve, reject, notify) {
           HttpService.get(ApiUrlService({
                                            name: 'User', 
                                            paramArray: [userId]
                                           }))
           .then(function(userData) {
               currentRequestedUser = new User(userData.data);
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