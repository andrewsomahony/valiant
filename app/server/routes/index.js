'use strict';

var express = require('express');
var router = express.Router();

var Responder = require(__base + 'lib/responder');

router.get('/', function(request, result) {
    Responder.render(result, 'index');
});

module.exports = router;
