'use strict';

var Request = require(__base + 'lib/request');

module.exports = Permissions;

function Permissions() {
   
}

Permissions.ableToEditUser = function(user) {
   if (false === this.isLoggedIn()) {
       return false;
   } else {
       return true === Request.getUser().isUser(user) ||
              true === this.isAdmin();
   }
}

Permissions.ableToSeeUser = function(user) {
    if (false === this.isLoggedIn()) {
        if (true === user.is_visible_to_public) {
            return true;
        } else {
            return false;
        }
    } else {
        if (true === Request.getUser().isUser(user)) {
            return true;
        } else {
            if (false === user.is_visible_to_users) {
                if (true === this.isAdmin()) {
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

Permissions.isLoggedIn = function() {
   return Request.getUser() ? true : false;
}

Permissions.isAdmin = function() {
   return this.isLoggedIn() && Request.getUser().isAdmin();
}

Permissions.isOwner = function() {
    return this.isLoggedIn() && Request.getUser().isOwner();
}