var express = require('express');
var Router = express.Router();

var Responder = require('../lib/responder');

var passport = require('passport');

var User = require('../models/user');
var UserLoginService = require('../lib/user_login');

Router.route('/')
.post(
   function(request, response, next) {
      passport.authenticate('local', function(error, user, info) {
         if (error) {
            Responder.withError(response, 400, error.message);
         } else {
            if (!user) {
               if (info && info.message) {                  
                  // This means there's an error
                  if (info.message === UserLoginService.emailUnverifiedErrorString) {
                     // We return 202, not processed yet, but the user information
                     // so that the front-end can present a valid e-mail token
                     // and e-mail address.
                     
                     // !!! TODO: maybe don't read the request directly?
                     
                     User.findByUsername(request.body.email, function(error, user) {
                        if (error) {
                           Responder.withMongooseError(response, 400, error);
                        } else {
                           Responder(response, 202, user.unregisteredInformationObject());
                        }
                     });
                  } else if (info.message === UserLoginService.incorrectUsernameErrorString) {
                     Responder.withError(response, 401, "Incorrect username or password");
                  } else if (info.message === UserLoginService.incorrectPasswordErrorString) {
                     Responder.withError(response, 401, "Incorrect username or password");
                  } else {
                     Responder.withError(response, 401, info.message);
                  }
               } else {
                  Responder.withError(response, 401, "Cannot login");
               }
            } else {
               request.login(user, function(error) {
                  if (error) {
                     Responder.withErrorObject(response, 401, error);
                  } else {
                     Responder(response, 200, user);
                  }
               });                
            }
         }
         
      })(request, response, next);
   }
);

module.exports = Router;