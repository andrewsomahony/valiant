'use strict';

var express = require('express');
var router = express.Router();

var Responder = require(__base + 'lib/responder');
var User = require(__base + 'models/user');

router.route('/:authToken')
.get(function(request, result) {
    //request.query.authToken;
    // Redirect to the home page so we run the front-end
    // code, which will look for the email_verified param
    // and redirect accordingly.
    
    var authToken = request.params.authToken;
    
    if (!authToken) {
        result.redirect("/?email_verified=false&notoken=true");
    } else {
        User.verifyEmail(authToken, function(error, user) {
            if (error) {
                result.redirect("/?email_verified=false&error=true");
            } else {
                result.redirect("/?email_verified=true");
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

module.exports = router;