'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.user.default';

registerController(name, ['$scope',
                          require('services/user_service'),
function($scope, UserService) {
   $scope.getCurrentUser = function() {
      return UserService.getCurrentRequestedUser();
   }
   
   $scope.isViewingLoggedInUser = function() {
      var currentUser = UserService.getCurrentUser();
      var requestedUser = UserService.getCurrentRequestedUser();
      
      return currentUser.id === requestedUser.id;
   }
}]);

module.exports = name;