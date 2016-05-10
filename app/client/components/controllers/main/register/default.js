'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.register.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
                          require('models/user'),
                          require('services/state_service'),
function($scope, UserService, ErrorModal, UserModel, StateService) {
   $scope.registrationUser = new UserModel();
   
   $scope.registrationInProgress = false;
   
   $scope.profilePicturePickerIsActive = {
      active: false
   };
   
   $scope.registerUser = function() {
      $scope.registrationInProgress = true;
      
      UserService.registerUser(this.registrationUser)
      .then(function() {
         // Redirect
         StateService.go('^.success');
      })
      .catch(function(error) {
         ErrorModal(error);
      })
      .finally(function() {
         $scope.registrationInProgress = false;
      })
   }
   
   $scope.selectProfilePicture = function() {
      $scope.profilePicturePickerIsActive.active = true;
   }
   
   $scope.onProfilePictureAdded = function(files) {
      $scope.registrationUser.profile_picture_file = files[0];
      // This is so we can use the profile_picture widget
      $scope.registrationUser.profile_picture_url = files[0].getUrl();
   }
   
   $scope.onProfilePictureProgress = function(progress) {
      
   }
   
   $scope.onProfilePictureError = function(error) {
      ErrorModal(error);
   }
}]);

module.exports = name;