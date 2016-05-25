'use strict';

var registerService = require('services/register');

var name = 'services.css';

registerService('factory', name, [
function() {
   function CSSService() {
      
   }
   
   CSSService.addRotationToStyleObject = function(styleObject, degrees) {
      var rotateString = "rotate(" + degrees + "deg)";
      
      style['-moz-transform'] = rotateString;
      style['-webkit-transform'] = rotateString;
      style['-o-transform'] = rotateString;
      style['transform'] = rotateString;
   }
   
   return CSSService;
}
])

module.exports = name;