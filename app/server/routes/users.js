var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');

var User = require(__base + 'models/user/user');

var Q = require('q');

router.route('/')
.get(function(request, result) {
    if (!Permissions.isAdmin(request)) {
        Responder.forbidden(result);
    } else {
        User.find(function(error, documents) {
            if (error) {
                Responder.withErrorObject(result, 400, error);
            } else {
                Responder(result, 200, documents);
            }
        });
    }
})
.post(function(request, result) {
    if (!Permissions.isAdmin(request)) {
        Responder.forbidden(result);
    } else {    
        var usersArray = request.body.users;
        
        Q.all(usersArray.map(function(u) {
            return Promise(function(resolve, reject, notify) {
                var user = new User({
                    email: u.email,
                    first_name: u.first_name,
                    last_name: u.last_name,
                    profile_picture_url: u.profile_picture_url,
                    questions: [],
                    facebook_id: u.facebook_id,
                    is_connected_to_facebook: u.is_connected_to_facebook
                });
                
                user.save(function(error, document) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(document);
                    }
                })        
            });
        }))
        .then(function(documents) {
            Responder(result, 201, documents);
        })
        .catch(function(error) {
            Responder.withErrorObject(result, 400, error);
        });
    }
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/register')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    var u = request.body.user;
    
    delete u['_id']; //When we register, we have no ID
    var user = new User(u);
    
    User.register(user, u.password, function(error, newUser) {
        if (error) {
            Responder.withErrorObject(result, 400, error);
        } else {
            newUser.sendAuthenticationEmail(function(error, u) {
                if (error) {
                    Responder.withErrorObject(result, 400, error);
                } else {
                    Responder(result, 201, u.unregisteredInformationObject());
                }
            });
            
        }
    });
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/register/email_available')
.get(function(request, result) {
    var emailAddress = request.query.email;
    
    if (!emailAddress) {
        Responder.withErrorMessage(result, 400, "Missing e-mail address!");
    } else {
        User.findByUsername(emailAddress, function(error, user) {
            if (error) {
                Responder.withErrorObject(result, 400, error);
            } else {
                if (!user) {
                    Responder.withErrorObject(result, 404);
                } else {
                    Responder.noContent(result);
                }
            }
        });
    }
})
.post(function(request, result) {
    Responder.methodNotAllowed(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/resend_email')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    var emailToken = request.body.emailToken;
    
    if (!emailToken) {
        Responder.withErrorMessage(result, 400, "Missing email token!");
    } else {
        User.resendAuthenticationEmail(emailToken, function(error, user) {
            if (error) {
                Responder.withErrorObject(result, 400, error);
            } else {
                Responder.noContent(result);
            }
        })
    }
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/forgot_password')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    var emailAddress = request.body.email;
    
    if (!emailAddress) {
        Responder.badRequest(result, "Missing e-mail address!");
    } else {
        var u = User.findByUsername(emailAddress, function(error, user) {
            if (error) {
                Responder.badRequest(result, error);
            } else {
                if (!user) {
                    Responder.notFound(result, "User not found!");
                } else {
                    user.sendPasswordResetEmail(function(error, user) {
                        if (error) {
                            Responder.badRequest(result, error);
                        } else {
                            Responder.noContent(result);
                        }
                    });
                }
            }
        })
    }
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/reset_password')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    var newPassword = request.body.password;
    var token = request.body.token;
    
    User.resetPassword(token, newPassword, function(error, user) {
        if (error) {
            Responder.badRequest(result, error);
        } else {
            Responder.noContent(result);
        }
    })
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/change_password')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/change_email')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
   Responder.methodNotAllowed(result); 
});

router.route('/me')
.get(function(request, result) {
    if (!Permissions.isLoggedIn(request)) {
        // I'm not sure what to do here:
        // This is a special route that we use to check if we're logged
        // in and get the logged in user information.
        
        // If we aren't logged in, can't we just return a "no content"
        // success flag instead of a forbidden?
        
        // The web browser displays every error in the console, so
        // visually seeing all those errors is a bit annoying, but
        // the correct behavior is to return an error.
        
        Responder.withErrorMessage(result, 403, "Not logged in");
    } else {
        Responder(result, 200, request.user.frontEndObject());
    }
})
.post(function(request, result) {
    Responder.methodNotAllowed(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/:userId')
.get(function(request, result) {
    User.findById(request.params.userId, function(error, user) {
        if (error) {
            Responder.withErrorObject(result, 400, error);
        } else {
            if (!user) {
                Responder.withErrorMessage(result, 404, "User not found!");
            } else {
                if (true === Permissions.ableToSeeUser(request, user)) {
                    Responder(result, 200, user.frontEndObject());    
                } else {
                    Responder.forbidden(result);
                }
                
            }
        }
    });
})
.patch(function(request, result) {
    var patchData = request.body.data;
    
    if (!patchData) {
        Responder.badRequest(result, "Missing patch data!");
    } else {
        User.findById(request.params.userId, function(error, user) {
            if (error) {
                Responder.badRequest(result, error);
            } else {
                if (!user) {
                   Responder.notFound(result, "Can't find user!");
                } else {
                    user.patch(patchData, function(error) {
                        if (error) {
                            Responder.badRequest(result, error);
                        } else {
                            Responder.ok(result, user.frontEndObject());
                        }
                    })
                }
            }
        })
    }
})
.post(function(request, result) {
    Responder.methodNotAllowed(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

module.exports = router;
