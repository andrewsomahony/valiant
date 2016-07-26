'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Request = require(__base + 'lib/request');

var Model = require(__base + 'lib/model');

var User = require(__base + 'db/models/user/user');

router.route('/register')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
   var userParam = Request.getBodyVariable(request, 'user');

   if (!userParam) {
      Responder.badRequest(result, "Missing user param!");
   } else {    
      var user = Model.userCreateModel(User, userParam);//new User(userParam);
            
      User.register(user, userParam.password, function(error, newUser) {
         if (error) {
            Responder.badRequest(result, error);
         } else {
            newUser.sendAuthenticationEmail(function(error, u) {
               if (error) {
                  Responder.badRequest(result, error);
               } else {
                  Responder.created(result, u.frontEndObject());
               }
            });    
         }
      });
   }
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/register/resend_email')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    var emailToken = Request.getBodyVariable(request, 'token');
    
    if (!emailToken) {
        Responder.badRequest(result, "Missing email token!");
    } else {
        User.resendAuthenticationEmail(emailToken, function(error, user) {
            if (error) {
                Responder.badRequest(result, error);
            } else {
                Responder.ok(result, user.frontEndObject());
            }
        })
    }
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

module.exports = router;