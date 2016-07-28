'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var Model = require(__base + 'lib/model');

var User = require(__base + 'db/models/user/user');
var QuestionModel = require(__base + 'db/models/question/question');
var CommentModel = require(__base + 'db/models/comment/comment');

var Q = require('q');

router.route('/')
.get(function(request, result) {
   if (!Permissions.isAdmin(request)) {
      Responder.forbidden(result);
   } else {
      QuestionModel.find()
      .populate("_creator")
      .exec(function(error, questions) {
         if (error) {
            Responder.badRequest(result, error);
         } else {
            Responder.ok(result, questions);
         }
      });
   }
})
.post(function(request, result) {

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

router.use(require("./ask"));

router.param('questionId', function(request, result, next, id) {
   if (!id) {
      Responder.badRequest(result, "Missing question id!");
   } else {
      QuestionModel.findById(id)
      .populate("_creator")
      .exec(function(error, question) {
         if (error) {
            Responder.badRequest(result, error);
         } else {
            if (!question) {
               Responder.notFound(result);
            } else {
               question.populateComments()
               .then(function() {
                  request.question = question;
                  next();
               })
               .catch(function(error) {
                  Responder.badRequest(result, error);
               })
            }
         }
      });
   }
});

router.route('/:questionId')
.get(function(request, result) {
   if (!Permissions.ableToSeeQuestion(request, request.question)) {
      Responder.forbidden(result);
   } else {
      Responder.ok(result, request.question.frontEndObject());
   }
})
.post(function(request, result) {
   Responder.methodNotAllowed(result);
})
.put(function(request, result) {
   Responder.methodNotAllowed(result);
})
.patch(function(request, result) {
   if (!Permissions.ableToEditQuestion(request, request.question)) {
      Responder.forbidden(result);
   } else {
      var patchData = Request.getBodyVariable(request, 'data');
      if (!patchData) {
         Responder.badRequest(result, "Missing patch data!");
      } else {
         request.question.userPatch(patchData, function(error) {
            if (error) {
               Responder.badRequest(result, error);
            } else {
               Responder.ok(result, request.question.frontEndObject());
            }
         })
      }
   }
})
.delete(function(request, result) {

});

router.route('/:questionId/comment')
.get(function(request, result) {
   // We can use this later to fetch a range?
   Responder.methodNotAllowed(result);
})
.post(function(request, result) {
   var comment = Request.getBodyVariable(request, 'comment');
   if (!comment) {
      Responder.badRequest(result, "Missing comment data!");
   } else {
      var commentModel = Model.userCreateModel(CommentModel, comment);
      //new CommentModel(comment);
      commentModel.type = "Question";

      commentModel._creator = Request.getUser(request).getId();
      commentModel._parent = request.question.getId();

      commentModel.save(function(error, newComment) {
         if (error) {
            Responder.badRequest(result, error);
         } else {
            var notificationPromise = null;
            //if (!Request.getUser(request).isUser(request.question._creator)) {
               notificationPromise = request.question._creator.addNotification(
                  "question_comment",
                  Request.getUser(request),
                  request.question
               );
            //}

            Promise.when(notificationPromise)
            .then(function() {
               newComment.populateCreator()
               .then(function() {
                  Responder.created(result, newComment.frontEndObject());
               })
               .catch(function(error) {
                  Responder.badRequest(result, error);
               });
            })
            .catch(function(error) {
               Responder.badRequest(result, error);
            })
         }
      });
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