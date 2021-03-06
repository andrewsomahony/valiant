'use strict';

var express = require('express');
var router = express.Router();

var utils = require(__base + 'lib/utils');

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var Q = require('q');

var User = require(__base + 'db/models/user/user');

var DateObject = require(__base + 'lib/date');

var NotificationModel = require(__base + 'db/models/notification/notification');

router.route('/check')
.get(function(request, result) {
   var currentUser = Request.getUser(request);

   if (!currentUser.isUser(request.requestedUser)) {
      Responder.forbidden(result);
   } else {
      request.requestedUser.populateNotifications()
      .then(function() {
         var hasNewNotifications = false;
         if (currentUser.checked_at) {
            request.requestedUser.notifications.every(function(notification) {
               if (DateObject.dateIsBefore(currentUser.checked_at, notification.updated_at)) {
                  hasNewNotifications = true;
                  return false;
               } else {
                  return true;
               }
            });
         } else {
            hasNewNotifications = true;
         }

         currentUser.checked_at = DateObject.newISODateString();
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
      })
      .catch(function(error) {
         Responder.badRequest(result, error);
      })
   }
})
.post(function(request, result) {
   var data = Request.getBodyVariable(request, 'data');

   if (!data) {
      Responder.badRequest(result, "Missing data!");
   } else {
      var promiseFnArray = [];
      if (data.notifications) {
         // We can't just use a patch with array indexes,
         // as the notifications aren't embedded, and the array
         // contents might change in the background.

         utils.merge(promiseFnArray, 
            utils.map(data.notifications, function(notification) {
               return Promise(function(resolve, reject) {
                  NotificationModel.findById(notification._id, function(error, n) {
                     if (error) {
                        reject(error);
                     } else {
                        n.is_new = notification.is_new;
                        n.is_unread = notification.is_unread;
                        
                        n.save(function(error) {
                           if (error) {
                              reject(error);
                           } else {
                              resolve();
                           }
                        })
                     }
                  })
               })
            })
         );
      }

      Q.all(promiseFnArray)
      .then(function() {
         Responder.noContent(result);
      })
      .catch(function(error) {
         Responder.badRequest(result, error);
      });
   }
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