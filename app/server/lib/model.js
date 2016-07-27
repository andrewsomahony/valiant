'use strict';

var Permissions = require(__base + 'lib/permissions');

var utils = require(__base + 'lib/utils');

var serverVariables = [
   "_id", "created_at", "updated_at"
];

module.exports = {};
module.exports.serverVariables = serverVariables;
module.exports.adminCreateModel = adminCreateModel;
module.exports.userCreateModel = userCreateModel;

function adminCreateModel(request, Class, object) {
   if (true === Permissions.isAdmin(request)) {
      return new Class(object);
   } else {
      return userCreateModel(Class, object);
   }
}

function userCreateModel(Class, object) {
   var newObject = utils.clone(object);

   removeServerVariablesFromObject(newObject);
   console.log(object, newObject);

   return new Class(newObject);
}

// object is passed by reference, so we can just
// directly modify it.

function removeServerVariablesFromObject(object) {
   utils.removeKeysFromObject(object, serverVariables);

   utils.forEachKey(object, function(k) {
      if (true === utils.isPlainObject(object[k])) {
         removeServerVariablesFromObject(object[k]);
      } else if (true === utils.isArray(object[k])) {
         object[k].forEach(function(arrayObject) {
            removeServerVariablesFromObject(arrayObject);
         });
      }
   });
}