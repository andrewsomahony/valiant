'use strict';

var registerController = require('controllers/register');

var utils = require('utils');

var name = 'controllers.main.question.default';

registerController(name, ['$scope',
                          require('services/question_service'),
                          require('services/user_service'),
function($scope, QuestionService, UserService) {
   $scope.currentEditingQuestion = QuestionService.getCurrentQuestion() ?
      QuestionService.getCurrentQuestion().clone() : null;

   $scope.mediaContainerSize = "300px";
   $scope.errorMessage = "";

   $scope.addingComment = false;

   $scope.getMediaContainerStyle = function() {
      var style = {};

      style['width'] = $scope.mediaContainerSize;
      style['height'] = $scope.mediaContainerSize;

      return style;
   }

   $scope.error = function(e) {
      if (!e) {
         $scope.errorMessage = "";
      } else {
         $scope.errorMessage = e.toString(false);
      }
   }

   // !!! This is currently unused, not sure
   // !!! why I had it here.
   $scope.getYoutubeMediaContainerStyle = function() {
      var style = $scope.getMediaContainerStyle();

      style['height'] = "" + utils.round(parseInt(style['width']) / 1.809) + "px";

      return style;
   }

   $scope.getQuestionTopic = function() {
      if ($scope.currentEditingQuestion.custom_topic) {
         return $scope.currentEditingQuestion.custom_topic;
      } else {
         return $scope.currentEditingQuestion.topic;
      }
   }

   $scope.getQuestionText = function() {
      return $scope.currentEditingQuestion.text;
   }

   $scope.onYoutubeRendererError = function(error) {

   }

   $scope.addComment = function() {
      $scope.addingComment = true;

      var obj = $scope.currentEditingQuestion.addToChildArrayAtIndex('comments', 0);
      obj.setInternalVariable('is_unborn', true);
   }

   $scope.saveComment = function(comment) {
      return Promise(function(resolve, reject) {
         QuestionService.addCommentToQuestion($scope.currentEditingQuestion,
            comment)
         .then(function(newComment) {
            $scope.addingComment = false;
            comment.fromModel(newComment);
            resolve();
         })
         .catch(function(error) {
            $scope.error(error);
            reject(error);
         });
      });
   }

   $scope.cancelComment = function(comment) {
      if (true === comment.getInternalVariable('is_unborn')) {
         $scope.currentEditingQuestion.deleteFromChildArray('comments', comment);
      }
      $scope.addingComment = false;
   }

   $scope.getStaticErrorMessage = function() {
      if (QuestionService.currentQuestionIsNotFound()) {
         return "Question does not exist.";
      } else if (QuestionService.currentQuestionIsNotAccessible()) {
         return "You do not have permission to view this question";
      } else {
         return "Unknown error";
      }
   }
}]);

module.exports = name;