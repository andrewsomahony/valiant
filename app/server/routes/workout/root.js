'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var User = require(__base + 'db/models/user/user');

var WorkoutModel = require(__base + 'db/models/workout/workout');

var Q = require('q');

router.route('/')
.get(function(request, result) {
   if (!Permissions.isAdmin(request)) {
      Responder.forbidden(result);
   } else {
      WorkoutModel.find(function(error, workouts) {
         if (error) {
            Responder.badRequest(result, error);
         } else {
            Responder.ok(result, workouts);
         }
      });
   }
})
.post(function(request, result) {
   if (!Permissions.isAdmin(request)) {
      Responder.forbidden(result);
   } else {
      var workouts = Request.getBodyVariable(request, 'workouts');

      Q.all(workouts.map(function(w) {
         return Promise(function(resolve, reject, notify) {
            new Workout(w).save(function(error, newWorkout) {
               if (error) {
                  reject(error);
               } else {
                  resolve(newWorkout);
               }
            });
         })
      }))
      .then(function(workouts) {
         Responder.created(result, workouts);
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
});

router.use(require('./new'));

router.route('/:workoutId')
.get(function(request, result) {
   WorkoutModel.findById(Request.getUrlParamVariable(request, 'workoutId'),
   function(error, workout) {
      if (error) {
         Responder.badRequest(result, error);
      } else {
         if (!workout) {
            Responder.notFound(result);
         } else {
            if (!Permissions.ableToSeeWorkout(request, workout)) {
               Responder.forbidden(result);
            } else {
               Responder.ok(result, workout);
            }
         }
      }
   })
})
.patch(function(request, result) {

})
.post(function(request, result) {
   Responder.methodNotAllowed(result);
})
.put(function(request, result) {
   Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
   Responder.methodNotAllowed(result);
})

module.exports = router;