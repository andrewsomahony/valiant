'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.question.ask';

registerController(name, ['$scope',
                          require('services/question_service'),
                          require('models/question'),
                          require('services/device_service'),
function($scope, QuestionService, QuestionModel,
DeviceService) {
   $scope.questionTopicOptions = QuestionService.getSelectableQuestionTypes();

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
   
   $scope.allocateNewQuestion();
}]);

module.exports = name;