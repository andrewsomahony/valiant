'use strict';

var registerService = require('services/register');

var utils = require('utils');

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

   var defaultSwimIcon = "images/swim_default.png";

   var setTypes = [
      {
         name: "Swim",
         icon: defaultSwimIcon
      },
      {
         name: "Kick",
         icon: "images/kick.png"
      },
      {
         name: "Choice",
         icon: defaultSwimIcon
      }
   ];

   var setStrokeModifications = [
      {
         name: "Scull",
         icon: "images/scull.png"
      },
      {
         name: "Fists",
         icon: "images/fist.png"
      },
      {
         name: "Drill",
         icon: "images/drill.png"
      },
      {
         name: "Pull",
         icon: "images/pull.png"
      },
      {
         name: "Snorkel",
         icon: "images/snorkel.png"
      },
      {
         name: "Fins",
         icon: "images/fins.png"
      }
   ];

   var setStrokes = [
      {
         name: "Butterfly",
         icon: "images/butterfly.jpg"
      },
      {
         name: "Backstroke",
         icon: "images/backstroke.jpg"
      },
      {
         name: "Breaststroke",
         icon: "images/breaststroke.jpg"
      },
      {
         name: "Freestyle",
         icon: "images/freestyle.jpg"
      },
      {
         name: "IM",
         icon: "images/im.jpg"
      },
      {
         name: "Choice",
         icon: defaultSwimIcon
      } 
   ];

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

   WorkoutBuilderService.getSetTypeNamesArray = function() {
      return utils.map(setTypes, function(type) {
         return type.name;
      });
   }

   WorkoutBuilderService.getSetStrokeModificationNamesArray = function() {
      return utils.map(setStrokeModifications, function(modification) {
         return modification.name;
      });
   }

   WorkoutBuilderService.getSetStrokeNamesArray = function() {
      return utils.map(setStrokes, function(stroke) {
         return stroke.name;
      });
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

   WorkoutBuilderService.getWorkoutElementsByAttribute = function(workout, array, attribute) {
      var returnArray = [];

      workout.sets.forEach(function(set) {
         set.elements.forEach(function(element) {
            if ('modifications' === attribute) {
               element['modifications'].forEach(function(modification) {
                  var e = utils.findInArray(array, function(a) {
                     return modification.name === a.name;
                  });

                  if (e) {
                     returnArray.push(e);
                  }
               });
               
            } else {
               var e = utils.findInArray(array, function(a) {
                  return element[attribute] === a.name;
               });

               if (e) {
                  returnArray.push(e);
               }
            }
         })
      });  

      return utils.removeDuplicatesFromArray(returnArray);    
   }

   WorkoutBuilderService.getWorkoutElementIconsByAttribute = function(workout, array, attribute) {
      var elements = WorkoutBuilderService.getWorkoutElementsByAttribute(workout, array, attribute);

      return utils.map(elements, function(e) {
         return e.icon || null;
      });
   }

   WorkoutBuilderService.getSetElementModificationIcon = function(modification) {
      var foundModification = utils.findInArray(setStrokeModifications, function(m) {
         return m.name === modification.name;
      });

      if (foundModification) {
         return foundModification.icon;
      } else {
         return null;
      }
   }

   WorkoutBuilderService.getWorkoutStrokes = function(workout) {
      return WorkoutBuilderService.getWorkoutElementsByAttribute(workout, setStrokes, 'stroke');
   }

   WorkoutBuilderService.getWorkoutIcons = function(workout) {
      var icons = [];

      var icons = utils.merge([],
         WorkoutBuilderService.getWorkoutElementIconsByAttribute(workout, setTypes, 'type'),
         WorkoutBuilderService.getWorkoutElementIconsByAttribute(workout, setStrokes, 'stroke'),
         WorkoutBuilderService.getWorkoutElementIconsByAttribute(workout, setStrokeModifications, 'modifications')
      );

      if (!icons.length) {
         return [defaultSwimIcon];
      } else {
         return utils.removeDuplicatesFromArray(icons);
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