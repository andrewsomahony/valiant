'use strict';

var registerController = require('controllers/register');
var utils = require('utils');

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
            var currentUser = UserService.getCurrentUser();
            
            console.log(currentUser);
            
            StateService.go('main.page.user.default',
            {userId: currentUser.id});
         }
      })
      .catch(function(e) {
         ErrorModal(e);
      });
   }
   
   $scope.statusMessage = function() {
      var verificationSuccess = StateService.params()['verification_success'];
      
      if (false === utils.isUndefinedOrNull(verificationSuccess)) {
         if (verificationSuccess) {
            return "E-Mail verification succeeded!";
         } else {
            return "E-Mail verification failed";
         }
      }

      var resetPasswordSuccess = StateService.params()['reset_password_success'];
      
      if (false === utils.isUndefinedOrNull(resetPasswordSuccess)) {
         if (resetPasswordSuccess) {
            return "Password reset succeeded!";
         } else {
            return "Password reset failed";
         }
      }
      
      var requiresLogin = StateService.params()['requires_login'];
      
      if (false === utils.isUndefinedOrNull(requiresLogin)) {
         if (requiresLogin) {
            return "You need to log in to do that.";
         } else {
            // This should never happen
            return "";
         }
      }
      
      return "";     
   }
}]);

module.exports = name;