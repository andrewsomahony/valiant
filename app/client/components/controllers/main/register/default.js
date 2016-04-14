'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.register.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
                          require('models/user'),
                          require('services/state_service'),
function($scope, UserService, ErrorModal, UserModel, StateService) {
   $scope.registrationInformation = {
      email: "",
      password: "",
      repeat_password: "",
      first_name: "",
      last_name: "",
      profile_picture_url: ""
   };
   
   $scope.registerUser = function() {
      var user = new UserModel($scope.registrationInformation);
      
      UserService.registerUser(user)
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