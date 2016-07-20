'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var User = require(__base + 'db/models/user/user');

var QuestionModel = require(__base + 'db/models/question/question');

var Q = require('q');

router.route('/')
.get(function(request, result) {
    if (!Permissions.isAdmin(request)) {
        Responder.forbidden(result);
    } else {
        User.find(function(error, documents) {
            if (error) {
                Responder.badRequest(result, error);
            } else {
                Responder(result, 200, documents);
            }
        });
    }
})
.post(function(request, result) {
    if (!Permissions.isAdmin(request)) {
        Responder.forbidden(result);
    } else {
        var usersArray = Request.getBodyVariable(request, 'users');
        
        Q.all(usersArray.map(function(u) {
            return Promise(function(resolve, reject, notify) {
                var user = new User(u);
                
                user.save(function(error, document) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(document);
                    }
                })        
            });
        }))
        .then(function(documents) {
            Responder.created(result, documents);
        })
        .catch(function(error) {
            Responder.badRequest(result, error);
        });
    }
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.use(require('./register'));
router.use(require('./change_email'));
router.use(require('./email_available'));
router.use(require('./forgot_password'));
router.use(require('./change_password'));
router.use(require('./me'));

router.param('userId', function(request, result, next, id) {
   if (!id) {
      Responder.badRequest("Missing user id!");
   } else {
      User.findById(id, function(error, user) {
         if (error) {
            Responder.badRequest(result, error);
         } else {
            if (!user) {
               Responder.notFound(result);
            } else {
               request.requestedUser = user;
               next();
            }
         }
      })
   }
});

router.route('/:userId')
.get(function(request, result) {
   if (true === Permissions.ableToSeeUser(request, request.requestedUser)) {
      request.requestedUser.populateRefs()
      .then(function() {
         Responder.ok(result, request.requestedUser.frontEndObject(['notifications']));
      })
      .catch(function(error) {
         Responder.badRequest(result, error);
      })  
   } else {
      Responder.forbidden(result);
   }
})
.patch(function(request, result) {
    var patchData = Request.getBodyVariable(request, 'data');
    
    if (!patchData) {
        Responder.badRequest(result, "Missing patch data!");
    } else {
       if (false === Permissions.ableToEditUser(request, request.requestedUser)) {
          Responder.forbidden(result);
       } else {
          request.requestedUser.patch(patchData, function(error) {
             if (error) {
                Responder.badRequest(result, error);
             } else {
                 request.requestedUser.populateRefs()
                 .then(function() {
                    Responder.ok(result, request.requestedUser.frontEndObject());
                 })
                 .catch(function(error) {
                     Responder.badRequest(result, error);
                 })
             }
          });
       }
    }
})
.post(function(request, result) {
    Responder.methodNotAllowed(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

module.exports = router;