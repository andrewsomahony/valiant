'use strict';

var registerService = require('services/register');

//var Chance = require('chance')

var uuid = require('node-uuid');

var name = 'services.id'

registerService('factory', name, [
function() {
   function IdService(length) {
      return uuid.v1({
         msecs: new Date().getTime(),
         nsecs: 5678
      });
   }

   return IdService;
}])

module.exports = name