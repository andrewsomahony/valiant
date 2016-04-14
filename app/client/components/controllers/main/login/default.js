'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.login.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
                          require('services/state_service'),
function($scope, UserService, ErrorModal, StateService) {
   $scope.loginInformation = {
      email: "",
      password: ""
   };
   
   $scope.login = function() {
      UserService.login($scope.loginInformation)
      .then(function(status) {
         if (202 === status.status) {
            StateService.go('^.unverified');
         } else {
            // Redirect to user profile page
         }
      })
      .catch(function(e) {
         ErrorModal(e);
      });
   }
}]);

module.exports = name;