'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var Model = require(__base + 'lib/model');

var QuestionModel = require(__base + 'db/models/question/question');

router.route('/ask')
.get(function(request, result) {
   Responder.methodNotAllowed(result);
})
.post(function(request, result) {
   if (!Permissions.isLoggedIn(request)) {
      Responder.forbidden(result);
   } else {
      var questionData = Request.getBodyVariable(request, 'question');

      if (!questionData) {
         Responder.badRequest(result, "Missing question data!");
      } else {
         var question = Model.userCreateModel(QuestionModel, questionData);//new QuestionModel(questionData);
         question._creator = Request.getUser(request).getId();

         question.save(function(error, q) {
            if (error) {
               Responder.badRequest(result, error);
            } else {
               q.populateCreator()
               .then(function() {
                  Responder.created(result, q.frontEndObject())
               })
               .catch(function(error) {
                  Responder.badRequest(result, error);
               })
            }
         });
      }
   }
})
.patch(function(request, result) {
   Responder.methodNotAllowed(result);
})
.put(function(request, result) {
   Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
   Responder.methodNotAllowed(result);
})

module.exports = router;