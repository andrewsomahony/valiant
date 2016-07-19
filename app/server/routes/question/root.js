'use strict';

var express = require('express');
var router = express.Router();

var Promise = require(__base + 'lib/promise');
var Responder = require(__base + 'lib/responder');
var Permissions = require(__base + 'lib/permissions');
var Request = require(__base + 'lib/request');

var User = require(__base + 'db/models/user/user');
var QuestionModel = require(__base + 'db/models/question/question');

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
      .populate("_creator comments._creator")
      .exec(function(error, question) {
         if (error) {
           // console.log(error);
            Responder.badRequest(result, error);
         } else {
            if (!question) {
               Responder.notFound(result);
            } else {
               request.question = question;
               next();
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
         request.question.patch(patchData, function(error) {
            if (error) {
               Responder.badRequest(result, error);
            } else {
               request.question
               .populate("comments._creator", 
               function(error, question) {
                  if (error) {
                     Responder.badRequest(result, error);
                  } else {
                     Responder.ok(result, question.frontEndObject());
                  }
               });
            }
         })
      }
   }
})
.delete(function(request, result) {

});

module.exports = router;