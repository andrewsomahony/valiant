'use strict';

var registerService = require('services/register');

var Chance = require('chance')

var name = 'services.id'

registerService('factory', name, [
function() {
   function IdService(length) {
      length = length || 32;

      var filenameChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return new Chance().string({length: length, pool: filenameChars}); 
   }

   return IdService;
}])

module.exports = name