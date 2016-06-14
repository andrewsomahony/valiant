'use strict';

var registerService = require('services/register');

var Chance = require('chance');

var name = 'services.random_number';

registerService('factory', name, [
function() {
   function RandomNumberService() {

   }
   
   RandomNumberService.randomNumber = function(min, max) {
      return new Chance().integer({min: min, max: max});
   }

   return RandomNumberService;
}
]);

module.exports = name;