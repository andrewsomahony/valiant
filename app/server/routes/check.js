'use strict';

var express = require('express');
var router = express.Router();

var Responder = require(__base + "lib/responder");
var Request = require(__base + "lib/request");

var User = require(__base + "db/models/user/user");
var ValiantError = require(__base + "lib/error");

router.route('/forgot_password/:authToken')
.get(function(request, result) {
   var authToken = Request.getUrlParamVariable(request, 'authToken');

   if (!authToken) {
      Responder.redirect(result, "/redirect?reset_password=false&error=", ValiantError.withMessage("Missing reset password token!"));
   } else {   
      User.findByResetPasswordToken(authToken, function(error, user) {
         if (error) {
            Responder.redirect(result, "/redirect?reset_password=false&error=" + error.toString());
         } else {
            if (!user) {
               Responder.redirect(result, "/redirect?reset_password=false&error=" + ValiantError.withMessage("Invalid token!").toString());
            } else {
               Responder.redirect(result, "/redirect?reset_password=true&token=" + authToken);
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
})

module.exports = router;