'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.register.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
                          require('models/user'),
                          require('services/state_service'),
function($scope, UserService, ErrorModal, UserModel, StateService) {
   $scope.registrationUser = new UserModel();
   
   $scope.registerUser = function() {
      UserService.registerUser(this.registrationUser)
      .then(function() {
         // Redirect
         StateService.go('^.success');
      })
      .catch(function(error) {
         ErrorModal(error);
      })
   }
}]);

module.exports = name;