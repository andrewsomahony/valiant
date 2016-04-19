'use strict';

var express = require('express');
var Router = express.Router();

var Responder = require(__base + 'lib/responder');

Router.route('/')
.get(function(request, result) {
   Responder.methodNotAllowed(result);
})
.post(function(request, result) {
   request.logout();
   Responder.noContent(result);
})
.put(function(request, result) {
   Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
   Responder.methodNotAllowed(result);
});

module.exports = Router;