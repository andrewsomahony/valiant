'use strict';

var express = require('express');
var router = express.Router();

var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');
var User = require(__base + 'models/user/user');

router.route('/change_password')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    var oldPassword = Request.getBodyVariable(request, 'old_password');
    var newPassword = Request.getBodyVariable(request, 'new_password');
    
    if (!Permissions.isLoggedIn(request)) {
        Responder.forbidden(result);
    } else {
        var user = Request.getUser(request);
        
        if (!user) {
           Responder.notFound(result, "No logged in user found!");
        } else {
           if (!user.isAuthenticated) {
              Responder.forbidden(result, "Cannot change password when user is not authenticated!"); 
           } else {
              user.authenticate(oldPassword, function(error, user) {
                   if (error) {
                      Responder.badRequest(result, error);
                   } else {
                      if (!user) {
                         Responder.unauthorized(result, "Incorrect old password!");
                      } else {
                         user.changePassword(newPassword, function(error, newUser) {
                             if (error) {
                                Responder.badRequest(result, error);
                             } else {
                                if (!newUser) {
                                   Responder.badRequest(result, "Cannot save new password!"); 
                                } else {
                                   Responder.ok(result, newUser.frontEndObject());
                                }
                             }
                         });
                      }
                   }
              });
           }
        }
    }
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

module.exports = router;