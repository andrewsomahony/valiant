'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var User = require(__base + 'models/user/user');

var Q = require('q');

router.route('/')
.get(function(request, result) {
    if (!Permissions.isAdmin(request)) {
        Responder.forbidden(result);
    } else {
        User.find(function(error, documents) {
            if (error) {
                Responder.badRequest(result, error);
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
        var usersArray = Request.getBodyVariable(request, 'users');
        
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
            Responder.created(result, documents);
        })
        .catch(function(error) {
            Responder.badRequest(result, error);
        });
    }
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.use(require('./register'));
router.use(require('./change_email'));
router.use(require('./email_available'));
router.use(require('./forgot_password'));
router.use(require('./change_password'));
router.use(require('./me'));

router.route('/:userId')
.get(function(request, result) {
    User.findById(Request.getUrlParamVariable(request, 'userId'), function(error, user) {
        if (error) {
            Responder.badRequest(result, error);
        } else {
            if (!user) {
                Responder.notFound(result);
            } else {
                if (true === Permissions.ableToSeeUser(request, user)) {
                    Responder.ok(result, user.frontEndObject());    
                } else {
                    Responder.forbidden(result);
                }
            }
        }
    });
})
.patch(function(request, result) {
    //var patchData = request.body.data;
    
    var patchData = Request.getBodyVariable(request, 'data');
    
    if (!patchData) {
        Responder.badRequest(result, "Missing patch data!");
    } else {
        User.findById(Request.getUrlParamVariable(request, 'userId'), function(error, user) {
            if (error) {
                Responder.badRequest(result, error);
            } else {
                if (!user) {
                   Responder.notFound(result, "Can't find user!");
                } else {
                   if (false === Permissions.ableToEditUser(request, user)) {
                      Responder.forbidden(result);
                   } else {
                      user.patch(patchData, function(error) {
                         if (error) {
                            Responder.badRequest(result, error);
                         } else {
                            Responder.ok(result, user.frontEndObject());
                         }
                      });
                   }
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