var m = require('./module')
var Chance = require('chance')

var name = 'idService'

m.factory(name, [
function() {
   function id(length) {
      var filenameChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return new Chance(Math.Random).string({length: 32, pool: filenameChars})  
   }

   return id;
}])

module.exports = name