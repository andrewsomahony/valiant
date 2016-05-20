'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var User = require(__base + 'db/models/user/user');

router.route('/change_email')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
   
    var newEmailAddress = Request.getBodyVariable(request, 'email');
    
    if (!Permissions.isLoggedIn(request)) {
        Responder.forbidden(result);
    } else {
        var user = Request.getUser(request);

        if (true === Permissions.ableToEditUser(request, user)) {        
            user.changeEmailAddress(newEmailAddress, function(error, user) {
                if (error) {
                    Responder.badRequest(result, error);
                } else {
                    Responder.ok(result, user.frontEndObject());
                }
            });
        } else {
            Responder.forbidden(result);
        }
    }
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
   Responder.methodNotAllowed(result); 
});

router.route('/change_email/resend')
.get(function(request, result) {
    Responder.methodNotAllowed(result);   
})
.post(function(request, result) {
    var token = Request.getBodyVariable(request, 'token');//request.body.token;
    
    User.findByPendingEmailToken(token, function(error, user) {
        if (error) {
           Responder.badRequest(result, error);
        } else {
           if (!user) {
              Responder.notFound(result, "User not found!");
           } else {
              if (false === Permissions.ableToEditUser(request, user)) {
                 Responder.forbidden(result);
              } else {
                 user.sendPendingEmailAuthenticationEmail(function(error, user) {
                     if (error) {
                         Responder.badRequest(result, error);
                     } else {
                         Responder.ok(result, user.frontEndObject());
                     }
                 });
              }
           }     
        }
    });
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/change_email/cancel')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    var token = Request.getBodyVariable(request, 'token');
    
    User.findByPendingEmailToken(token, function(error, user) {
        if (error) {
           Responder.badRequest(result, error);
        } else {
            if (!user) {
                Responder.notFound(result);
            } else {
                if (false === Permissions.ableToEditUser(request, user)) {
                   Responder.forbidden(result);
                } else {
                   user.cancelEmailAddressChange(function(error, user) {
                      if (error) {
                         Responder.badRequest(result, error);     
                      } else {
                         Responder.ok(result, user.frontEndObject());
                      }
                   })
                }
            }
        }
    })
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
})

module.exports = router;