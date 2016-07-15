'use strict';

var registerController = require('controllers/register');

var utils = require('utils');

var name = 'controllers.main.question.default';

registerController(name, ['$scope',
                          require('services/question_service'),
function($scope, QuestionService) {
   $scope.currentEditingQuestion = QuestionService.getCurrentQuestion() ?
      QuestionService.getCurrentQuestion().clone() : null;
   
   $scope.mediaContainerSize = "300px";

   $scope.getMediaContainerStyle = function() {
      var style = {};

      style['width'] = $scope.mediaContainerSize;
      style['height'] = $scope.mediaContainerSize;

      return style;
   }

   $scope.getYoutubeMediaContainerStyle = function() {
      var style = $scope.getMediaContainerStyle();

      style['height'] = "" + utils.round(parseInt(style['width']) / 1.809) + "px";

      console.log(style);

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