'use strict';

var Promise = require(__base + "lib/promise");
var Q = require('q');

var QuestionModel = require(__base + 'db/models/question/question');

module.exports = function(schema, options) {
   options = options || {};

   schema.methods.frontEndObject = function() {
      var object = {
         "_id": this.getId(),
         "topic": this.topic,
         "custom_topic": this.custom_topic,
         "text": this.text,
         "created_at": this.created_at,
         "updated_at": this.updated_at
      }

      // These currently don't have frontEndObject
      // methods, so we don't need to worry

      object.youtube_video = this.youtube_video;
      object.videos = this.videos;
      object.pictures = this.pictures;
      object.preview_pictures = this.preview_pictures;

      if (this.fieldIsPopulated("_creator")) {
         object._creator = this._creator.frontEndObject();
      }

      object.comments = [];
      this.comments.forEach(function(comment) {
         object.comments.push(comment.frontEndObject());
      })

      return object;
   }

   schema.methods.populateComments = function() {
      var self = this;

      return Promise(function(resolve, reject) {
         Q.all(self.comments.map(function(comment) {
            comment.populate("_creator", function(error, c) {
               if (error) {
                  reject(error);
               } else {
                  resolve();
               }
            });
         }))
         .then(function() {
            resolve();
         })
         .catch(function(error) {
            reject(error);
         })
      });
   }

   schema.methods.setCommentCreatorsIfEmpty = function(creatorId) {
      // This goes through and sees what 
      // comments don't have any _creator variable
      // set, and sets them to the given creatorId
      var self = this;

      return Promise(function(resolve, reject) {
         self.comments.forEach(function(c) {
            if (!c._creator) {
               c._creator = creatorId;
            }
         });

         self.save(function(error) {
            if (error) {
               reject(error);
            } else {
               resolve(self);
            }
         });
      });

   }
}