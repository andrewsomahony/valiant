'use strict';

var Request = require(__base + 'lib/request');

module.exports = Permissions;

function Permissions() {
   
}

Permissions.ableToEditUser = function(request, user) {
   if (false === this.isLoggedIn(request)) {
       return false;
   } else {
       return true === Request.getUser(request).isUser(user) ||
              true === this.isAdmin(request);
   }
}

Permissions.ableToSeeUser = function(request, user) {
    if (false === this.isLoggedIn(request)) {
        if (true === user.is_visible_to_public) {
            return true;
        } else {
            return false;
        }
    } else {
        if (true === Request.getUser(request).isUser(user)) {
            return true;
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
}

Permissions.isLoggedIn = function(request) {
   return Request.getUser(request) ? true : false;
}

Permissions.isAdmin = function(request) {
   return this.isLoggedIn(request) && Request.getUser(request).isAdmin();
}

Permissions.isOwner = function(request) {
    return this.isLoggedIn(request) && Request.getUser(request).isOwner();
}