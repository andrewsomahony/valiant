'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.reset_password.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
                          require('services/state_service'),
function($scope, UserService, ErrorModal, StateService) {
   $scope.formData = {
      password: "",
      repeat_password: ""
   };
   
   $scope.resetPasswordToken = StateService.params()['token'];
   
   $scope.resettingInProgress = false;
   
   $scope.resetPassword = function() {
      $scope.resettingInProgress = true;
      
      UserService.resetPassword($scope.formData.password, 
      $scope.resetPasswordToken)
      .then(function() {
         //Redirect to login?
         StateService.go('main.page.login.default',
         {reset_password_success: true});
      })
      .catch(function(error) {
         ErrorModal(error);
      })
      .finally(function() {
         $scope.resettingInProgress = false;
      })
   }
}]);

module.exports = name;