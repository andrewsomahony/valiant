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
function($scope, QuestionService, QuestionModel,
DeviceService, S3UploaderService, Promise, ParallelPromise,
FFMpegService, ErrorModal) {
   $scope.questionTopicOptions = QuestionService.getSelectableQuestionTypes();
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
   }
   
   $scope.askQuestion = function() {
      $scope.isAskingQuestion = true;
      QuestionService.ask($scope.currentQuestion)
      .then(function(newQuestion) {
         console.log(newQuestion);
         // Redirect to question description page.
         //$scope.currentQuestion = newQuestion;
      })
      .catch(function(error) {
         ErrorModal(error);
      })
      .finally(function() {
         $scope.isAskingQuestion = false;
      })
      //console.log($scope.currentQuestion);
   }
   
   $scope.allocateNewQuestion();
}]);

module.exports = name;