'use strict';

var registerService = require('services/register');

var name = 'services.workout_builder';

registerService('factory', name, [require('models/workout_builder/workout'),
                                  require('services/http_service'),
                                  require('services/api_url'),
                                  require('services/promise'),
function(WorkoutModel, HttpService, ApiUrlService, Promise) {
   function WorkoutBuilderService() {

   }

   var currentWorkout = null;

   WorkoutBuilderService.getCurrentWorkout = function() {
      return currentWorkout;
   }

   WorkoutBuilderService.getSetTypesArray = function() {
      return ["Swim", "Kick"];
   }

   WorkoutBuilderService.getSetStrokeModificationsArray = function() {
      return ["Scull", "Fists", "Drill", "Pull"];
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

   return WorkoutBuilderService;
}
]);

module.exports = name;