'use strict';

var crypto = require('crypto');

var Promise = require(__base + 'lib/promise');
var ValiantError = require(__base + 'lib/error');

module.exports = {};
module.exports.createToken = createToken;
module.exports.convertTokenBufferToHexString = convertTokenBufferToHexString;

function createToken(length, returnAsString) {
   return Promise(function(resolve, reject) {
      crypto.randomBytes(length, function(error, buffer) {
         if (error) {
            reject(ValiantError.fromErrorObject(error));
         } else {
            if (returnAsString) {
               resolve(convertTokenBufferToHexString(buffer));
            } else {
               resolve(buffer);
            }
         }
         
      })
   });
}

function convertTokenBufferToHexString(buffer) {
   return buffer.toString('hex');
}