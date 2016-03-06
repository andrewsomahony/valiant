require('domready')(function() {
    console.log("DOM IS READY!");
    
    var bootFn = require('./init/boot');
    bootFn();
})
