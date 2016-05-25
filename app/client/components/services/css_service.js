'use strict';

var registerService = require('services/register');

var name = 'services.css';

registerService('factory', name, [
function() {
   function CSSService() {
      
   }
   
   CSSService.addRotationToStyleObject = function(styleObject, degrees) {
      var rotateString = "rotate(" + degrees + "deg)";
      
      styleObject['-moz-transform'] = rotateString;
      styleObject['-webkit-transform'] = rotateString;
      styleObject['-o-transform'] = rotateString;
      styleObject['transform'] = rotateString;
   }
   
   return CSSService;
}
])

module.exports = name;