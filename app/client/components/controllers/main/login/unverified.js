'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.login.unverified';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
function($scope, UserService, ErrorModal) {
   
   $scope.isSendingEmail = false;
   $scope.hasSentEmail = false;
   
   $scope.getCurrentUnverifiedUser = function() {
      return UserService.getCurrentUnverifiedUser();
   }
   
   $scope.getEmailAddress = function() {
      var u = this.getCurrentUnverifiedUser();      
      return u.email;
   }
   
   $scope.resendVerificationEmail = function() {
      $scope.isSendingEmail = true;
      $scope.hasSentEmail = false;
      
      UserService.resendVerificationEmail()
      .then(function() {
         // Display some sort of message
         $scope.hasSentEmail = true;
      })
      .catch(function(error) {
         ErrorModal(error);
      })
      .finally(function() {
         $scope.isSendingEmail = false;
      })
   }
   
}]);

module.exports = name;