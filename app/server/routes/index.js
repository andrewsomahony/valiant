var express = require('express');
var router = express.Router();

router.get('/', function(request, result, next) {
    result.render('index');
});

module.exports = router;
