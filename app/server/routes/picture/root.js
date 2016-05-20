'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var Picture = require(__base)

router.route('/')
.get(function(request, result) {
   if (!Permissions.isAdmin(request)) {
      Responder.forbidden(result);
   } else {
      
   }
})
.post(function(request, result) {
   if (!Permissions.isAdmin(request)) {
      Responder.forbidden(result);
   } else {
      
   }
})
.put(function(request, result) {
   Responder.methodNotAllowed(request);
})
.delete(function(request, result) {
   Responder.methodNotAllowed(result);
});

router.route('/:pictureId')
.get(function(request, result) {
   
})
.patch(function(request, result) {
   
})
.put(function(request, result) {
   Responder.methodNotAllowed(result);
})
.post(function(request, result) {
   Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
   Responder.methodNotAllowed(result);
})

router.route('/:pictureId/get')
.get(function(request, result) {
   
})
.put(function(request, result) {
   Responder.methodNotAllowed(result);
})
.post(function(request, result) {
   Responder.methodNotAllowed(result);
})
.patch(function(request, result) {
   Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
   Responder.methodNotAllowed(result);
})

module.exports = router;