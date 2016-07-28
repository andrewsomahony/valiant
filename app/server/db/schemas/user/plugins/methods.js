'use strict';

var WorkoutModel = require(__base + 'db/models/workout/workout');
var QuestionModel = require(__base + 'db/models/question/question');
var NotificationModel = require(__base + "db/models/notification/notification");

var Q = require('q');
var Promise = require(__base + 'lib/promise');
var ValiantError = require(__base + 'lib/error');

var utils = require(__base + 'lib/utils');

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.hasPendingEmail = function() {
      return this.pending_email;
   }
   
   schema.methods.isUser = function(otherUser) {
      return this.getId().equals(otherUser.getId());
   }

   schema.methods.populateNotifications = function() {
      var self = this;

      return Promise(function(resolve, reject) {
         NotificationModel.find({_creator: self.getId()})
         .sort({updated_at: -1})
         .populate("_creator")
         .populate("_parent")
         .limit(10)
         .exec(function(error, notifications) {
            if (error) {
               reject(error);
            } else {
               self.notifications = notifications || [];
               resolve();
            }
         });
      })
   }

   schema.methods.populateWorkouts = function() {
      var self = this;

      return Promise(function(resolve, reject) {
         WorkoutModel.find({_creator: self.getId()})
         .populate('_creator')
         .sort({updated_at: -1})
         .exec(function(error, workouts) {
            if (error) {
               reject(error);
            } else {
               self.workouts = workouts || [];
               resolve();
            }
         });
      });
   }

   schema.methods.populateQuestions = function() {
      var self = this;

      return Promise(function(resolve, reject) {
         QuestionModel.find({_creator: self.getId()})
         .populate('_creator')
         .sort({updated_at: -1})
         .exec(function(error, questions) {
            if (error) {
               reject(error);
            } else {
               Q.all(utils.map(questions, function(q) {
                  return q.populateComments();
               }))
               .then(function() {
                  self.questions = questions || [];
                  resolve();
               })
               .catch(function(error) {
                  reject(error);
               });
            }
         })
      })
   }

   schema.methods.populateRefs = function() {
      var populatePromises = [];

      populatePromises.push(this.populateWorkouts());
      populatePromises.push(this.populateQuestions());
      populatePromises.push(this.populateNotifications());

      return Promise(function(resolve, reject) {
         Q.all(populatePromises)
         .then(function() {
            resolve();
         })
         .catch(function(error) {
            reject(error);
         })
      });
   }

   // Types:
   // "question_comment"

   schema.methods.addNotification = function(type, creator, parent) {
      return Promise(function(resolve, reject) {
         var notification = new NotificationModel();

         if ('question_comment' === type) {
            notification.type = 'Question';
            notification._creator = creator.getId();
            notification._parent = parent.getId();

            notification.text = "commented on your question";

            notification.save(function(error, n) {
               if (error) {
                  reject(error);
               } else {
                  resolve(n);
               }
            })
         } else {
            reject(ValiantError.withMessage("Unknown notification type " + type));
         }
      });
   }
   
   // We don't need to return everything
   schema.methods.frontEndObject = function(valuesToSkip) {
      if (!this.isAuthenticated) {
         return {
            email: this.email,
            email_token: this.email_token,
            created_at: this.created_at
         };
      } else {
         var object = {
            _id: this.getId(),
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name,
            profile_picture: this.profile_picture,
            access_type: this.access_type,
            questions: this.questions,
            notifications: this.notifications,
            created_at: this.created_at,
            updated_at: this.updated_at,
            is_visible_to_users: this.is_visible_to_users,
            is_visible_to_public: this.is_visible_to_public,
            is_admin: this.isAdmin()
         };
         
         if (this.hasPendingEmail()) {
            object['pending_email'] = this.pending_email;
            object['pending_email_token'] = this.pending_email_token;
         }

         if (this.workouts) {
            object.workouts = this.workouts.map(function(workout) {
               return workout.frontEndObject();
            });
         }

         if (this.questions) {
            object.questions = this.questions.map(function(question) {
               return question.frontEndObject();
            });
         }

         if (this.notifications) {
            object.notifications = this.notifications.map(function(notification) {
               return notification.frontEndObject();
            });
         }

         utils.removeKeysFromObject(object, valuesToSkip);
         
         return object;
      }
   }
   
   schema.methods.isOwner = function() {
      return 'owner' === this.access_type;
   }
   
   schema.methods.isAdmin = function() {
      return 'owner' === this.access_type ||
             'admin' === this.access_type;
   }
}