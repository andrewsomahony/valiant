'use strict';

var express = require('express');
var router = express.Router();

var Responder = require(__base + 'lib/responder');
var User = require(__base + 'models/user/user');
var Request = require(__base + 'lib/request');

var ValiantError = require(__base + 'lib/error');

router.route('/:authToken')
.get(function(request, result) {
    // Redirect to the home page so we run the front-end
    // code, which will look for the email_verified param
    // and redirect accordingly.
    
    var authToken = Request.getUrlParamVariable(request, 'authToken');//request.params.authToken;
    
    if (!authToken) {
        Responder.redirect(result, "/redirect?email_verified=false&notoken=true");
    } else {
        User.verifyEmail(authToken, function(error, user) {
            if (error) {
                Responder.redirect(result, "/redirect?email_verified=false&error=" + ValiantError.fromErrorObject(error).toString());
            } else {
                Responder.redirect(result, "/redirect?email_verified=true");
            }
        });
    }
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/pending_email/:authToken')
.get(function(request, result) {
    var authToken = Request.getUrlParamVariable(request, 'authToken');//request.params.authToken;
    
    if (!authToken) {
        Responder.redirect(result, "/redirect?email_changed=false&notoken=true");
    } else {
        User.setNewEmailAddressWithToken(authToken, function(error, user) {
            if (error) {
                Responder.redirect(result, "/redirect?email_changed=false&error=" + ValiantError.fromErrorObject(error).toString());
            } else {
                Responder.redirect(result, "/redirect?email_changed=true");
            }
        });
    }    
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
})

module.exports = router;