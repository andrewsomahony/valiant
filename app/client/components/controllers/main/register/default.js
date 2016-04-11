'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.register.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
function($scope, UserService, ErrorModal) {
   $scope.registrationInformation = {
      email: "",
      password: "",
      repeat_password: "",
      first_name: "",
      last_name: "",
      profile_picture_url: ""
   };
   
   $scope.registerUser = function() {
      UserService.registerUser($scope.registrationInformation)
      .then(function(userData) {
         console.log("USER DATA!", userData);
      })
      .catch(function(error) {
         ErrorModal(error);
      })
   }
}]);

module.exports = name;