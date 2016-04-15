'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.login.unverified';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
function($scope, UserService, ErrorModal) {
   
   $scope.getCurrentUnverifiedUser = function() {
      return UserService.getCurrentUnverifiedUser();
   }
   
   $scope.getEmailAddress = function() {
      var u = this.getCurrentUnverifiedUser();      
      return u.email;
   }
   
   $scope.resendVerificationEmail = function() {
      UserService.resendVerificationEmail()
      .then(function() {
         // Display some sort of message
      })
      .catch(function(error) {
         ErrorModal(error);
      });
   }
   
}]);

module.exports = name;