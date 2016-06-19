'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.question.unauthorized';

registerController(name, ['$scope',
function($scope) {
   $scope.unauthorizedMessage = "To ask a question, you need to log in first.";
}]);

module.exports = name;