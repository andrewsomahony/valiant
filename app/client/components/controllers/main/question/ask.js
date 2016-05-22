'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.question.ask';

registerController(name, ['$scope',
                          require('services/question_service'),
                          require('models/question'),
function($scope, QuestionService, QuestionModel) {
   $scope.questionTopicOptions = QuestionService.getSelectableQuestionTypes();

   $scope.allocateNewQuestion = function() {
      $scope.currentQuestion = new QuestionModel();  
      $scope.currentQuestion.topic = $scope.questionTopicOptions[0];
   }
   
   $scope.allocateNewQuestion();
}]);

module.exports = name;