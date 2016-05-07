'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.login.forgot_password';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
function($scope, UserService, ErrorModal) {
   $scope.formData = {
      emailAddress: ""
   };
   
   $scope.hasRequestedNewPassword = false;
   $scope.isRequestingNewPassword = false;
   
   $scope.requestNewPassword = function() {
      $scope.isRequestingNewPassword = true;
      UserService.forgotPassword($scope.formData.emailAddress)
      .then(function() {
         $scope.hasRequestedNewPassword = true;
      })
      .catch(function(error) {
         $scope.hasRequestedNewPassword = false;
         ErrorModal(error);
      })
      .finally(function() {
         $scope.isRequestingNewPassword = false;
      })
   }
}]);

module.exports = name;