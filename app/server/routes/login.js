var express = require('express');
var Router = express.Router();

var Responder = require('../lib/responder');

var passport = require('passport');

var User = require('../models/user/user');
var UserLoginService = require('../lib/user_login');

Router.route('/')
.post(
   function(request, response, next) {
      passport.authenticate('local', function(error, user, info) {
         if (error) {
            Responder.badRequest(response, error.message);
         } else {
            if (!user) {
               if (info && info.message) {                  
                  // This means there's an error
                  if (info.message === UserLoginService.incorrectUsernameErrorString) {
                     Responder.unauthorized(response, "Incorrect username or password");
                  } else if (info.message === UserLoginService.incorrectPasswordErrorString) {
                     Responder.unauthorized(response, "Incorrect username or password");
                  } else {
                     Responder.unauthorized(response, info.message);
                  }
               } else {
                  Responder.unauthorized(response, "Cannot login");
               }
            } else {
               if (info && 
                   info.message && 
                   info.message === UserLoginService.emailUnverifiedErrorString) {
                  // The only message that results in a success code from us
                  // is if the user is unverified (by e-mail)
                  
                  // The authenticator still returns the user object, but we just need to
                  // watch for this message and return the right status code, so the front-end
                  // can deal with it properly.
                  
                  Responder.accepted(response, user.frontEndObject());
               } else {
                  request.login(user, function(error) {
                     if (error) {
                        Responder.unauthorized(response, error);
                     } else {
                        Responder.ok(response, user.frontEndObject());
                     }
                  });   
               }             
            }
         }
         
      })(request, response, next);
   }
);

module.exports = Router;