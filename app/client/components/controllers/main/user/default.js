'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.user.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('models/user'),
function($scope, UserService, UserModel) {
   // Clone what we get from the UserService
   // to allow for editing and such
   $scope.currentEditingUser = 
      new UserModel(UserService.getCurrentRequestedUser().toObject());
   
   $scope.isViewingLoggedInUser = function() {
      var currentUser = UserService.getCurrentUser();
      
      return currentUser.id === $scope.currentEditingUser.id;
   }
}]);

module.exports = name;