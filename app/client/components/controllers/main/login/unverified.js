'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.login.unverified';

registerController(name, ['$scope',
                          require('services/user_service'),
function($scope, UserService) {
   
   $scope.getCurrentUnverifiedUser = function() {
      return UserService.getCurrentUnverifiedUser();
   }
   
   $scope.getEmailAddress = function() {
      var u = this.getCurrentUnverifiedUser();      
      return u.email;
   }   
   
}]);

module.exports = name;