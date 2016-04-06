var express = require('express');
var router = express.Router();

var Q = require('q');

var User = require('../models/user');

router.route('/')
.get(function(request, result) {
    result.status(200).json({
        user: "Something"
    });
})
.post(function(request, result) {
    
});

router.route('/:userId')
.get(function(request, result) {
    
})
.put(function(request, result) {
    
})
.delete(function(request, result) {
    
})

module.exports = router;
