'use strict';

var express = require('express');
var router = express.Router();

var Responder = require(__base + 'lib/responder');
var Request = require(__base + 'lib/request');

var User = require(__base + 'db/models/user/user');

router.route('/forgot_password')
.get(function(request, result) {
    // !!! Maybe we should make the e-mail link
    // !!! redirect to here?
    
    // !!! That way we can check the token.
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    var emailAddress = Request.getBodyVariable(request, 'email');
    
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
                    if (!user.isAuthenticated) {
                       Responder.forbidden(result, "This e-mail address is registered but not authorized.");
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

router.route('/forgot_password/reset')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    var newPassword = Request.getBodyVariable(request, 'password');
    var token = Request.getBodyVariable(request, 'token');
    
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

module.exports = router;