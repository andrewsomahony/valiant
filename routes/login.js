var express = require('express');
var Router = express.Router();

var passport = require('passport');

Router.route('/')
.post(
   passport.authenticate('local'),
function(request, response, next) {
   response.status(200);
   next();
});