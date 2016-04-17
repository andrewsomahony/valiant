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
         }
      })
      .catch(function(e) {
         ErrorModal(e);
      });
   }
   
   $scope.verificationSuccessMessage = function() {
      var verificationSuccess = StateService.params()['verification_success'];
      
      if (false === utils.isUndefinedOrNull(verificationSuccess)) {
         if (verificationSuccess) {
            return "E-Mail verification succeeded!";
         } else {
            return "E-Mail verification failed";
         }
      } else {
         return "";
      }
   }
}]);

module.exports = name;