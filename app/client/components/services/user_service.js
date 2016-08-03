'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.user_service';

registerService('factory', name, [
                                    require('services/promise'),
                                    require('services/http_service'),
                                    require('models/user'),
                                    require('models/notification'),
                                    require('services/api_url'),
                                    require('services/error'),
                                    require('services/progress'),
                                    require('services/serial_promise'),
                                    require('services/parallel_promise'),
                                    require('services/s3_uploader_service'),
                                    require('models/picture'),
                                    require('services/media_service'),
                                    require('services/workout_builder_service'),
                                    '$timeout',
function(Promise, HttpService, UserModel, NotificationModel, ApiUrlService,
ErrorService, ProgressService, SerialPromise, ParallelPromise, S3UploaderService,
PictureModel, MediaService, WorkoutBuilderService, $timeout) {    
    var currentUser = null;
    var currentUnverifiedUser = null;
    var currentRequestedUser = null;
    
    var currentRequestedUserIsNotAccessible = false;
    var currentRequestedUserIsNotFound = false;
    
    function UserService() {
        
    }
    
    UserService.dataResolverFn = function(state, params) {
        return Promise(function(resolve, reject, notify) {
            var promiseFnArray = [];
            
            promiseFnArray.push(function(forNotify) {
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
            
            if ('main.page.user.default' === state) {
                if (!params.userId) {
                    reject(ErrorService.localError("Missing user id!"));
                } else {                          
                    promiseFnArray.push(function(forNotify) {
                        if (true === forNotify) {
                            return ProgressService(0, 1);
                        } else {
                            return Promise(function(resolve, reject, notify) {
                                HttpService.get(ApiUrlService({name: 'User', paramArray: [params.userId]}))
                                .then(function(user) {
                                    currentRequestedUserIsNotAccessible = false;
                                    currentRequestedUserIsNotFound = false;
                                    
                                    currentRequestedUser = new UserModel(user.data, true);
                                    console.log("CURRENT REQUETED USER", currentRequestedUser);
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
                                        resolve();
                                    } else if (true === ErrorService.isNotFound(error)) {
                                        currentRequestedUserIsNotFound = true;
                                        resolve();
                                    } else {
                                        reject(error);
                                    }
                                });                                
                            })
                        }
                    });  
                }
            }
            
            if (!promiseFnArray.length) {
                resolve({});
            } else {
                ParallelPromise.withNotify(promiseFnArray)
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
    
    // Helper method to update our currentUser
    // object after a user object has been updated.
    
    // Basically, it checks to see if the currentUser
    // is the same user as the one updated (same id),
    // and if so, sets the currentUser to the updated
    // user.
    
    function UpdateCurrentUserIfSame(user) {
        if (currentUser &&
            user.id === currentUser.id) {
            currentUser = user.clone();
        }
    }
    
    UserService.getCurrentUnverifiedUser = function() {
        return currentUnverifiedUser;
    }
    
    UserService.getCurrentRequestedUser = function() {
        return currentRequestedUser;
    }
    
    // See the comment for updateCurrentUserIfSame
    
    function UpdateCurrentRequestedUserIfSame(user) {
        if (currentRequestedUser &&
            user.id === currentRequestedUser.id) {
            currentRequestedUser = user.clone();
        }
    }
    
    function UpdateCurrentAndRequestedUsersIfSame(user) {
        UpdateCurrentUserIfSame(user);
        UpdateCurrentRequestedUserIfSame(user);
    }
    
    UserService.currentRequestedUserIsNotAccessible = function() {
        return currentRequestedUserIsNotAccessible;
    }
    
    UserService.currentRequestedUserIsNotFound = function() {
        return currentRequestedUserIsNotFound;
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
                       name: 'ForgotPassword'
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
                        name: 'Register'
                    },
                    {
                        name: 'ResendEmail'
                    }
                ]), null, {token: u.email_token})
                .then(function(data) {
                    currentUnverifiedUser = new UserModel(data.data, true)
                    resolve();
                })
                .catch(function(error) {
                    reject(error);
                })
            }         
        });
    }
    
    UserService.uploadProfilePicture = function(user, forNotify) {
        return MediaService.uploadMedia('profile_picture', user.profile_picture, forNotify);
    }
    
    UserService.registerUser = function(user) {
        return Promise(function(resolve, reject, notify) {
            HttpService.post(ApiUrlService([{name: 'User'}, {name: 'Register'}]), 
            null, {
                    user: user.toObject(true)
                  })
            .then(function(data) {
                currentUser = null;
                currentUnverifiedUser = new UserModel(data.data, true);
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
    
    // We use a PATCH on the server to save the user,
    // so we need the previous user.
    
    UserService.saveUser = function(user, previousUser) {
        var promiseFnArray = [];
        
        if (user.profile_picture.url !== previousUser.profile_picture.url) {
            promiseFnArray.push(function(existingData, index, forNotify) {
                return UserService.uploadProfilePicture(user, forNotify);
            })
        }
        
        promiseFnArray.push(function(existingData, index, forNotify) {
            // By this point, if we have a profile picture,
            // the new and correct value is in this user object.
            
            // !!! This is kinda...I dunno, it just feels
            // !!! a bit hackneyed.
            
            if (true === forNotify) {
                return ProgressService(0, 1, "Saving user...");
            } else {
                return Promise(function(resolve, reject, notify) {
                    var patch = user.createPatch(previousUser, true);  
                    if (!patch.length) {
                       resolve(user);   
                    } else {
                       HttpService.patch(ApiUrlService([
                           {
                               name: 'User',
                               paramArray: [user.id]
                           }
                       ]), null, {data: patch})
                       .then(function(data) {
                           // The user gets returned
                           // because the server could update
                           // values that we don't patch (like updated_at)
                           var newUser = new UserModel(data.data, true);
                           
                           UpdateCurrentAndRequestedUsersIfSame(newUser);
                           
                           resolve(newUser);
                       })
                       .catch(function(e) {
                           reject(e);
                       })
                    }                    
                });
            }
        });

        return Promise(function(resolve, reject, notify) {
            SerialPromise.withNotify(promiseFnArray, null, ['user'], true)
            .then(function(data) {
                // The user gets returned
                // because the server could update
                // values that we don't patch (like updated_at)
                resolve(user);
            }, null, function(progress) {
                notify(progress);
            })
            .catch(function(e) {
                reject(e);
            })
        })
    }
    
    UserService.changePassword = function(oldPassword, newPassword) {
       return Promise(function(resolve, reject, notify) {
          HttpService.post(ApiUrlService([
              {
                  name: 'User'
              },
              {
                  name: 'ChangePassword'
              }
          ]), null, {old_password: oldPassword, new_password: newPassword})
          .then(function(data) {
              var user = new UserModel(data.data, true);
              UpdateCurrentAndRequestedUsersIfSame(user);
              resolve(user);
          })
          .catch(function(error) {
              reject(error);
          })
       });  
    }
    
    UserService.changeEmail = function(newEmail) {
        return Promise(function(resolve, reject, notify) {
            HttpService.post(ApiUrlService([
                {
                    name: 'User'
                },
                {
                    name: 'ChangeEmail'
                }
            ]), null, {email: newEmail})
            .then(function(data) {
                var user = new UserModel(data.data, true);
                UpdateCurrentAndRequestedUsersIfSame(user);                
                resolve(user);
            })
            .catch(function(error) {
                reject(error);
            })
        })
    }
    
    UserService.resendPendingEmailVerificationEmail = function(user) {
        return Promise(function(resolve, reject, notify) {
           var pendingEmailToken = user.pending_email_token;
           
           if (!pendingEmailToken) {
               reject(ErrorService.localError("User doesn't have a pending e-mail token!"));
           } else {           
              HttpService.post(ApiUrlService([
                   {
                      name: 'User'
                   },
                   {
                      name: 'ChangeEmail'
                   },
                   {
                      name: 'ResendEmail'
                   }
             ]), null, {token: pendingEmailToken})
               .then(function(data) {
                   var newUser = new UserModel(data.data, true);
                   UpdateCurrentAndRequestedUsersIfSame(newUser);
                   resolve(newUser);
               })
               .catch(function(error) {
                   reject(error);
               });
           }
        });
    }
    
    UserService.cancelPendingEmailVerification = function(user) {
        return Promise(function(resolve, reject, notify) {
           var pendingEmailToken = user.pending_email_token;
           
           if (!pendingEmailToken) {
               reject(ErrorService.localError("User doesn't have a pending e-mail token!"));
           } else {           
              HttpService.post(ApiUrlService([
                   {
                      name: 'User'
                   },
                   {
                      name: 'ChangeEmail'
                   },
                   {
                      name: 'Cancel'
                   }
             ]), null, {token: pendingEmailToken})
               .then(function(data) {
                   var newUser = new UserModel(data.data, true);
                   UpdateCurrentAndRequestedUsersIfSame(newUser);
                   resolve(newUser);
               })
               .catch(function(error) {
                   reject(error);
               });
           }
        });        
    }

    UserService.inlineDeleteWorkout = function(user, workout) {
       return Promise(function(resolve, reject) {
          if (!utils.findInArray(user.workouts, function(w) {
             return w.isEqualToModel(workout);
          })) {
             reject(ErrorService.localError("Workout does not belong to user!"));
          } else {
             WorkoutBuilderService.deleteWorkout(workout)
             .then(function() {
                user.deleteFromChildArray('workouts', workout);
                UpdateCurrentAndRequestedUsersIfSame(user);
                resolve();
             })
             .catch(function(error) {
                reject(error);
             })
          }
       });
    }

    // Because this checks for changes,
    // we want the option to NOT update the current
    // users incase we want to animate something.

    UserService.check = function(user, canUpdate) {
       canUpdate = utils.checkBoolean(canUpdate, true);

       return Promise(function(resolve, reject) {
           HttpService.get(ApiUrlService([
               {
                   name: 'User',
                   paramArray: [user.id]
               },
               {
                   name: 'Check'
               }
           ]))
           .then(function(response) {
              if (true === response.isOk()) {
                 if (response.data.notifications) {
                    user.notifications = NotificationModel.allocateArray(
                        response.data.notifications, 
                        null, true);
                 }
                 if (true === canUpdate) {
                    UpdateCurrentAndRequestedUsersIfSame(user);
                 }
              }
              resolve(user);
           })
           .catch(function(error) {
               reject(error);
           })
       })
    }

    function PostCheckUser(user, data) {
      return Promise(function(resolve, reject) {
         var postData = {};

         if (data.notifications) {
            postData.notifications = utils.map(data.notifications, function(notification) {
               return notification.toObject(true);
            });
         }

         HttpService.post(ApiUrlService([
            {
               name: 'User',
               paramArray: [user.id]
            },
            {
               name: 'Check'
            }
         ]), null, {data: postData})
         .then(function() {
            if (data.notifications) {
               data.notifications.forEach(function(n) {
                  var userNotification = utils.findInArray(user.notifications,
                  function(element) {
                     return element.id === n.id;
                  });
                  
                  if (userNotification) {
                     userNotification.is_new = n.is_new;
                     userNotification.is_unread = n.is_unread;
                  }
               });
            }

            UpdateCurrentAndRequestedUsersIfSame(user);

            resolve();
         })
         .catch(function(error) {
            reject(error);
         });
      });
    }

    UserService.markNotificationsAsRead = function(user, notifications) {
       return Promise(function(resolve, reject) {
          notifications = notifications || user.getUnreadNotifications();

          if (!notifications.length) {
             resolve();
          } else {
           // var clonedNotifications = utils.clone(notifications);

            notifications.forEach(function(notification) {
               notification.is_unread = false;
            });

            PostCheckUser(user, {
               notifications: notifications
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

    UserService.markNotificationsAsOld = function(user, notifications) {
       return Promise(function(resolve, reject) {
         notifications = notifications || user.getNewNotifications();

         if (!notifications.length) {
            resolve();
         } else {
            var clonedNotifications = utils.clone(notifications);

            notifications.forEach(function(notification) {
               notification.is_new = false;
            });
            $timeout(function() {

               PostCheckUser(user, {
                  notifications: notifications
               })
               .then(function() {
                  resolve();
               })
               .catch(function(error) {
                  reject(error);
               });
            });
         }
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