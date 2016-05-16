'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var User = require(__base + 'models/user/user');

router.route('/me')
.get(function(request, result) {
    if (!Permissions.isLoggedIn()) {
        // I'm not sure what to do here:
        // This is a special route that we use to check if we're logged
        // in and get the logged in user information.
        
        // If we aren't logged in, can't we just return a "no content"
        // success flag instead of a forbidden?
        
        // The web browser displays every error in the console, so
        // visually seeing all those errors is a bit annoying, but
        // the correct behavior is to return an error.
        
        Responder.forbidden(result, "Not logged in");
    } else {
        Responder.ok(result, Request.getUser().frontEndObject());
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