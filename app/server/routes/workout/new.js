'use strict';

var express = require('express');
var router = express.Router();

var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var WorkoutModel = require(__base + 'db/models/workout/workout');

router.route('/new')
.get(function(request, result) {
   Responder.methodNotAllowed();
})
.post(function(request, result) {
   if (!Permissions.isLoggedIn(request)) {
      Responder.notAllowed(result);
   } else {
      var workoutParam = Request.getBodyVariable(request, 'workout');
      if (!workoutParam) {
         Responder.badRequest(result, "Missing workout variable!");
      } else {
         var workout = new WorkoutModel(workoutParam);
         workout._creator = Request.getUser(request).getId();

         workout.save(function(error, w) {
            if (error) {
               Responder.badRequest(result, error);
            } else {
               w.populateCreator()
               .then(function() {
                  Responder.ok(result, w.frontEndObject());
               })
               .catch(function(error) {
                  Responder.badRequest(result, error);
               });
            }
         });
      }
   }
})
.patch(function(request, result) {
   Responder.methodNotAllowed();
})
.put(function(request, result) {
   Responder.methodNotAllowed();
})
.delete(function(request, result) {
   Responder.methodNotAllowed();
})

module.exports = router;