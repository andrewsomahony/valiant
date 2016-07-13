'use strict';

var Request = require(__base + 'lib/request');

module.exports = Permissions;

function Permissions() {
   
}

Permissions.ableToSeeQuestion = function(request, question) {
   var creator = question.getCreator();
   if (!creator) {
      console.log("Permissions.ableToSeeQuestion: Question _creator variable not populated!");
      return false;
   } else {
      return Permissions.ableToSeeUser(request, creator);
   }
}

Permissions.ableToEditQuestion = function(request, question) {
   var creator = question.getCreator();
   if (!creator) {
      console.log("Permissions.ableToEditQuestion: Question _creator variable not populated!");
      return false;
   } else {
      return Permissions.ableToEditUser(request, creator);
   }
}

Permissions.ableToSeeWorkout = function(request, workout) {
   var creator = workout.getCreator();
   if (!creator) {
      console.log("Permissions.ableToSeeWorkout: Workout _creator variable not populated!");
      return false;
   } else {
      return Permissions.ableToSeeUser(request, creator);
   }
}

Permissions.ableToEditWorkout = function(request, workout) {
   var creator = workout.getCreator();
   if (!creator) {
      console.log("Permissions.ableToEditWorkout: Workout _creator variable not populated!");
      return false;
   } else {
      return Permissions.ableToEditUser(request, creator);
   }
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