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
         "text": this.text
      }

      // These currently don't have frontEndObject
      // methods, so we don't need to worry

      object.youtube_video = this.youtube_video;
      object.videos = this.videos;
      object.pictures = this.pictures;
      object.preview_pictures = this.preview_pictures;

      if (this.populated('_creator')) {
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
}