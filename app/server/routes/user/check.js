'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var User = require(__base + 'db/models/user/user');

var NotificationModel = require(__base + 'db/models/notification/notification');

router.route('/check')
.get(function(request, result) {
   var currentUser = Request.getUser(request);

   if (!currentUser.isUser(request.requestedUser)) {
      Responder.forbidden(result);
   } else {
      request.requestedUser.populateNotifications()
      .then(function() {
         if (error) {
            Responder.badRequest(result, error);
         } else {
            var hasNewNotifications = false;
            request.requestedUser.notifications.forEach(function(notification) {
               
            });

            currentUser.checked_at = new ISODate();
            currentUser.save(function(error) {
               if (error) {
                  Responder.badRequest(result, error);
               } else {
                  if (true === hasNewNotifications) {
                     Responder.ok(result, 
                        {notifications: request.requestedUser.notifications.map(function(n) {
                           return n.frontEndObject();
                        })
                     });
                  } else {
                     Responder.noContent(result);
                  }
               }
            });
         }
      })
      .catch(function(error) {
         Responder.badRequest(result, error);
      })
   }
})
.post(function(request, result) {
   Responder.methodNotAllowed(result);
})
.put(function(request, result) {
   Responder.methodNotAllowed(result);
})
.patch(function(request, result) {
   Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
   Responder.methodNotAllowed(result);
})

module.exports = router;