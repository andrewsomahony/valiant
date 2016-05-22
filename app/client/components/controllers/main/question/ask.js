'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.question.ask';

registerController(name, ['$scope',
                          require('services/question_service'),
                          require('models/question'),
function($scope, QuestionService, QuestionModel) {
   $scope.currentQuestion = new QuestionModel();
   $scope.questionTopicOptions = QuestionService.getSelectableQuestionTypes();
  
   $scope.currentQuestion.topic = $scope.questionTopicOptions[0];
}]);

module.exports = name;