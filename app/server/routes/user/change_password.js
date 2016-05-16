'use strict';

var express = require('express');
var router = express.Router();

var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');
var User = require(__base + 'models/user/user');

router.route('/change_password')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    Responder.noContent(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

module.exports = router;