'use strict';

module.exports = Permissions;

function Permissions() {
   
}

Permissions.ableToSeeUser = function(request, user) {
    if (false === this.isLoggedIn(request)) {
        if (true === user.is_visible_to_public) {
            return true;
        } else {
            return false;
        }
    } else {
        if (false === user.is_visible_to_users) {
            if (true === this.isAdmin(request)) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}

Permissions.isLoggedIn = function(request) {
   return request.user ? true : false;
}

Permissions.isAdmin = function(request) {
   return this.isLoggedIn(request) && request.user.isAdmin();
}

Permissions.isOwner = function(request) {
    return this.isLoggedIn(request) && request.user.isOwner();
}