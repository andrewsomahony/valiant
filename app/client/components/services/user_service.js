'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.user_service';

registerService('factory', name, [
                                    require('services/promise'),
                                    require('services/http_service'),
                                    require('models/user'),
                                    require('services/api_url'),
                                    require('services/error'),
                                    require('services/progress'),
                                    require('services/serial_promise'),
                                    require('services/s3_uploader_service'),
function(Promise, HttpService, UserModel, ApiUrlService,
ErrorService, ProgressService, SerialPromise, S3UploaderService) {    
    var currentUser = null;
    var currentUnverifiedUser = null;
    var currentRequestedUser = null;
    
    var currentRequestedUserIsNotAccessible = false;
    
    function UserService() {
        
    }
    
    UserService.dataResolverFn = function(state, params) {
        return Promise(function(resolve, reject, notify) {
            var promiseFnArray = [];
            
            if (!currentUser) {
                // If we don't have a user, check to see if
                // we are logged in and we can get a profile.
                // This happens mostly on forced page reload.
                
                promiseFnArray.push(function(existingData, index, forNotify) {
                    if (true === forNotify) {
                        return ProgressService(0, 1);
                    } else {
                        return Promise(function(resolve, reject, notify) {
                            HttpService.get(ApiUrlService([{name: 'User'}, {name: 'Me'}]))
                            .then(function(user) {
                                currentUser = new UserModel(user.data, true);
                                resolve({});
                            })
                            .catch(function(error) {
                                if (true === ErrorService.isForbidden(error)) {
                                    // Means we aren't logged in
                                    resolve({});
                                } else {
                                    reject(error);
                                }
                            })
                        })
                    }
                });
            }
            
            if ('main.page.user.default' === state) {
                if (!params.userId) {
                    reject(ErrorService.localError("Missing user id!"));
                } else {  
                    if (currentUser &&
                        currentUser.id === params.userId) {
                        // If the requested user is us, no need
                        // to hit the server again.
                        currentRequestedUser = currentUser.clone();
                        currentRequestedUserIsNotAccessible = false;
                    } else {                          
                        promiseFnArray.push(function(existingData, index, forNotify) {
                            if (true === forNotify) {
                                return ProgressService(0, 1);
                            } else {
                                return Promise(function(resolve, reject, notify) {
                                    HttpService.get(ApiUrlService({name: 'User', paramArray: [params.userId]}))
                                    .then(function(user) {
                                        currentRequestedUserIsNotAccessible = false;
                                        currentRequestedUser = new UserModel(user.data, true);
                                        resolve({});    
                                    })
                                    .catch(function(error) {
                                        // We need to check the error code:
                                        // If we are forbidden to view this user
                                        // for whatever reason, we need to set something
                                        // within our service so we can figure out what to
                                        // display on the page.
                                        
                                        // Basically, we don't want to reject, as this error
                                        // doesn't need a modal box displayed, instead it needs
                                        // something displayed on the page itself, but we need to
                                        // tell the page controller what to do.
                                        
                                        currentRequestedUser = null;
                                        if (true === ErrorService.isForbidden(error)) {
                                            currentRequestedUserIsNotAccessible = true;
                                            resolve({});
                                        } else {
                                            reject(error);
                                        }
                                    });                                  
                                })
                            
                            }
                        });  
                    }     

                }
            }
            
            if (!promiseFnArray.length) {
                resolve({});
            } else {
                SerialPromise.withNotify(promiseFnArray)
                .then(function() {
                    resolve({});
                })
                .catch(function(e) {
                    reject(e);
                });
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
    
    UserService.currentRequestedUserIsNotAccessible = function() {
        return currentRequestedUserIsNotAccessible;
    }
    
    UserService.getCurrentUserId = function() {
        return this.getCurrentUser().id;
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
    
    UserService.forgotPassword = function(emailAddress) {
        return Promise(function(resolve, reject, notify) {
            if (!emailAddress) {
                reject(ErrorService.localError("Missing e-mail address!"));
            } else {
                HttpService.post(ApiUrlService([
                    {
                        name: 'User'
                    },
                    {
                        name: 'ForgotPassword'
                    }
               ]), null, 
               {
                   email: emailAddress
               })
               .then(function() {
                   resolve();
               })
               .catch(function(error) {
                   reject(error);
               })
            }
        });
    }
    
    UserService.resetPassword = function(newPassword, token) {
        return Promise(function(resolve, reject, notify) {
           if (!newPassword) {
               reject(ErrorService.localError("Missing password!"));
           } else if (!token) {
               reject(ErrorService.localError("Missing token!"));
           } else {
               HttpService.post(ApiUrlService([
                   {
                       name: 'User'
                   },
                   {
                       name: 'ResetPassword'
                   }
               ]), null, 
               {
                  token: token,
                  password: newPassword
               })
               .then(function() {
                   resolve();
               })
               .catch(function(error) {
                   reject(error);
               });
           }
        });
    }
    
    UserService.resendVerificationEmail = function() {
        return Promise(function(resolve, reject, notify) {
            var u = UserService.getCurrentUnverifiedUser();
            
            if (!u) {
                reject(ErrorService.localError("Missing unverified user!"));
            } else {
                HttpService.post(ApiUrlService([
                    {
                        name: 'User'
                    },
                    {
                        name: 'Reverify'
                    }
                ]), null, {emailToken: u.email_token})
                .then(function() {
                    resolve();
                })
                .catch(function(error) {
                    reject(error);
                })
            }         
        });
    }
    
    UserService.uploadProfilePicture = function(user, forNotify) {
        forNotify = utils.isUndefinedOrNull(forNotify) ? false : forNotify;
        
        if (true === forNotify) {
            if (!user.profile_picture_file) {
                return ProgressService(0, 1);
            } else {
                return S3UploaderService.getProgressInfo('profile_picture', user.profile_picture_file);
            }
        } else {
            return Promise(function(resolve, reject, notify) {
                if (!user.profile_picture_file) {
                    resolve();
                } else {
                    S3UploaderService('profile_picture', user.profile_picture_file)
                    .then(function(data) {
                        user.profile_picture_url = data.url;
                        user.profile_picture_file = null;
                        resolve();    
                    }, null, function(progress) {
                        notify(progress);
                    })
                    .catch(function(e) {
                        reject(e);
                    })
                }
            });
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
    
    UserService.registerUserWithPicture = function(user) {
        var promiseFnArray = [];
      
        promiseFnArray.push(function(existingData, index, forNotify) {
           return UserService.uploadProfilePicture(user, forNotify);
        });

        promiseFnArray.push(function(existingData, index, forNotify) {
           if (true === forNotify) {
              return ProgressService(0, 1, "Registering user...");
           } else {
              return UserService.registerUser(user);
           }
        });
        
        return Promise(function(resolve, reject, notify) {
            SerialPromise.withNotify(promiseFnArray)
            .then(function() {
                resolve();
            }, null, function(progress) {
                notify(progress);
            })
            .catch(function(e) {
                reject(e);
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