'use strict';

var registerService = require('services/register');

var name = 'services.workout_builder';

registerService('factory', name, [require('models/workout_builder/workout'),
                                  require('services/http_service'),
                                  require('services/api_url'),
                                  require('services/promise'),
                                  require('services/error'),
function(WorkoutModel, HttpService, ApiUrlService, Promise,
ErrorService) {
   function WorkoutBuilderService() {

   }

   var currentWorkout = null;
   var currentWorkoutIsNotFound = false;
   var currentWorkoutIsNotAccesible = false;

   WorkoutBuilderService.dataResolverFn = function(state, params) {
      return Promise(function(resolve, reject, notify) {
         if ('main.page.workout_builder.default' === state) {
            if (!params.workoutId) {
               reject(ErrorService.localError("Missing workout id!"));
            } else {
               currentWorkoutIsNotAccesible = false;
               currentWorkoutIsNotFound = false;

               HttpService.get(ApiUrlService([{name: 'Workout', paramArray: [params.workoutId]}]))
               .then(function(data) {
                  WorkoutBuilderService.setCurrentWorkout(new WorkoutModel(data.data, true));
                  resolve();
               })
               .catch(function(error) {
                  WorkoutBuilderService.setCurrentWorkout(null);

                  // Just like with the user, if we get an error,
                  // we want to display feedback on the page itself as to what
                  // went wrong, so we allow the request to finish (by resolving),
                  // but we set some internal stuff so we can get a better idea of what
                  // happened, so we can show the user on the page.

                  if (true === ErrorService.isForbidden(error)) {
                     currentWorkoutIsNotAccesible = true;
                     resolve();
                  } else if (true === ErrorService.isNotFound(error)) {
                     currentWorkoutIsNotFound = true;
                     resolve();
                  } else {
                     reject(error);
                  }
               })
            }
         } else {
            WorkoutBuilderService.setCurrentWorkout(null);
            resolve();
         }
      });
   }

   WorkoutBuilderService.setCurrentWorkout = function(w) {
      currentWorkout = w;
      if (w) {
         currentWorkoutIsNotFound = false;
         currentWorkoutIsNotAccesible = false;
      }
   }

   WorkoutBuilderService.getCurrentWorkout = function() {
      return currentWorkout;
   }

   WorkoutBuilderService.currentWorkoutIsNotFound = function() {
      return currentWorkoutIsNotFound;
   }

   WorkoutBuilderService.currentWorkoutIsNotAccesible = function() {
      return currentWorkoutIsNotAccesible;
   }

   WorkoutBuilderService.updateCurrentWorkoutIfSame = function(workout) {
      if (workout.id === currentWorkout.id) {
         currentWorkout = workout.clone();
      }
   }

   WorkoutBuilderService.getSetTypesArray = function() {
      return ["Swim", "Kick", "Choice"];
   }

   WorkoutBuilderService.getSetStrokeModificationsArray = function() {
      return ["Scull", "Fists", "Drill", "Pull", "Choice"];
   }

   WorkoutBuilderService.getSetStrokesArray = function() {
      return ["Butterfly",
              "Backstroke", 
              "Breaststroke", 
              "Freestyle",
              "IM",
              "Choice"];
   }

   WorkoutBuilderService.formatNotesString = function(notes) {
      if (!notes) {
         return "";
      } else {
         return "[" + notes + "]";
      }
   }

   WorkoutBuilderService.formatQuantityString = function(quantity) {
      if (!quantity) {
         return "0x";
      } else {
         return "" + quantity + "x";
      }
   }

   WorkoutBuilderService.formatSetTotalString = function(total) {
      if (!total) {
         return "0";
      } else {
         return "" + total;
      }
   }

   WorkoutBuilderService.createWorkout = function(workoutModel) {
      return Promise(function(resolve, reject, notify) {
         HttpService.post(ApiUrlService([
            {name: 'Workout'}, {name: 'New'}]),
         null, {workout: workoutModel.toObject(true)})
         .then(function(data) {
            resolve(new WorkoutModel(data.data, true));
         })
         .catch(function(error) {
            reject(error);
         })
      });
   }

   WorkoutBuilderService.saveWorkout = function(workout, previousWorkout) {
      return Promise(function(resolve, reject, notify) {
         var patchData = workout.createPatch(previousWorkout, true);

         if (!patchData.length) {
            resolve(workout);
         } else {
            HttpService.patch(ApiUrlService([
               {
                  name: 'Workout', 
                  paramArray: [workout.id]
               }
            ]), null, {data: patchData})
            .then(function(data) {
               var workout = new WorkoutModel(data.data, true);
               WorkoutBuilderService.updateCurrentWorkoutIfSame(workout);
               resolve(workout);
            })
            .catch(function(error) {
               reject(error);
            });
         }
      });
   }

   WorkoutBuilderService.deleteWorkout = function(workout) {

   }

   return WorkoutBuilderService;
}
]);

module.exports = name;