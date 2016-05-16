'use strict';

var express = require('express');
var router = express.Router();

var Responder = require(__base + 'lib/responder');
var Request = require(__base + 'lib/request');

var User = require(__base + 'models/user/user');

router.route('/email_available')
.get(function(request, result) {
    var emailAddress = request.query.email;
    
    if (!emailAddress) {
        Responder.badRequest(result, "Missing e-mail address!");
    } else {
        User.findByUsername(emailAddress, function(error, user) {
            if (error) {
                Responder.badRequest(result, error);
            } else {
                if (!user) {
                    Responder.notFound(result);
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

module.exports = router;