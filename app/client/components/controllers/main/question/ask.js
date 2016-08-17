'use strict';

var registerController = require('controllers/register');

var utils = require('utils');

var name = 'controllers.main.question.ask';

registerController(name, ['$scope',
                          require('services/question_service'),
                          require('models/question'),
                          require('services/device_service'),
                          require('services/s3_uploader_service'),
                          require('services/promise'),
                          require('services/parallel_promise'),
                          require('services/ffmpeg_service'),
                          require('services/error_modal'),
                          require('services/question_type_service'),
                          require('services/state_service'),
function($scope, QuestionService, QuestionModel,
DeviceService, S3UploaderService, Promise, ParallelPromise,
FFMpegService, ErrorModal, QuestionTypeService, StateService) {
   $scope.questionTopicOptions = utils.map(QuestionTypeService.getQuestionTypes(), function(type) {
      return type.name;
   });
   $scope.isAskingQuestion = false;

   $scope.allocateNewQuestion = function() {
      $scope.currentQuestion = new QuestionModel();  
      $scope.currentQuestion.topic = $scope.questionTopicOptions[0];
   
      if (DeviceService.isDesktop()) {
         // Desktops have more memory in general
         // and can convert more videos using our
         // videoconverter.js
         $scope.currentQuestion.allocateVideos(2);
         $scope.currentQuestion.allocatePictures(3);
      } else {
         // Mobile devices tend to only be able to handle
         // conversion of one video.
         $scope.currentQuestion.allocateVideos(1);
         $scope.currentQuestion.allocatePictures(2);
      }
      $scope.currentQuestion.allocatePreviewPictures(1);
   }
   
   $scope.askQuestion = function() {
      $scope.isAskingQuestion = true;

      QuestionService.ask($scope.currentQuestion)
      .then(function(newQuestion) {
         StateService.go('main.question', {questionId: newQuestion.id});
      })
      .catch(function(error) {
         ErrorModal(error);
      })
      .finally(function() {
         $scope.isAskingQuestion = false;
      })
   }
   
   $scope.allocateNewQuestion();
}]);

module.exports = name;