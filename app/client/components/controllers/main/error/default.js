'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.error.default';

registerController(name, ['$scope',
                          require('services/error_page_service'),
function($scope, ErrorPageService) {
   $scope.errorMessage = ErrorPageService.getErrorMessage();
}]);

module.exports = name;