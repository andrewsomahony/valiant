'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.workout_builder.unauthorized';

registerController(name, ['$scope',
function($scope) {
   $scope.unauthorizedMessage = "To make a workout set, you need to log in first.";
}]);

module.exports = name;