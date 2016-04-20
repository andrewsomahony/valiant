'use strict';

module.exports = Permissions;

function Permissions() {
   
}

// This function is called before we attempt to see 
// if this userId is a private account.  Basically
// we want to see if we can even perform a database lookup.

Permissions.ableToSeeUserWithId = function(request, userId) {
   if (true === this.isLoggedIn()) {
      if (userId !== request.user.getId() &&
          false === this.isAdmin()) {
         return false;       
      }
   }
   
   // If we are logged in, we still could see this user
   // if their privacy settings allow it.
   
   return true;
}

Permissions.isLoggedIn = function(request) {
   return request.user ? true : false;
}

Permissions.isAdmin = function(request) {
   return request.user && request.user.isAdmin();
}