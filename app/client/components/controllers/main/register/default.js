'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.register.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
                          require('models/user'),
                          require('services/state_service'),
                          require('services/serial_promise'),
                          require('services/promise'),
                          require('services/progress'),
                          require('services/profile_picture_service'),
                          require('services/picture_service'),
function($scope, UserService, ErrorModal, 
UserModel, StateService, SerialPromise, Promise, ProgressService,
ProfilePictureService, PictureService) {
   $scope.registrationUser = new UserModel();
   
   $scope.registrationInProgress = false;
   
   $scope.profilePicturePickerIsActive = {
      active: false
   };
   
   $scope.registrationProgress = null;
         
   $scope.registerUser = function() {
      $scope.registrationInProgress = true;

      UserService.registerUserWithPicture($scope.registrationUser)
      .then(function() {
         StateService.go('main.page.login.unverified');
      }, null, function(progress) {
         $scope.registrationProgress = progress;
      })
      .catch(function(e) {
         ErrorModal(e);
      })
      .finally(function() {
         $scope.registrationInProgress = false;
      })
   }
   
   $scope.getRegistrationProgressMessage = function() {
      return "Registering...";
   }
   
   $scope.selectProfilePicture = function() {
      $scope.profilePicturePickerIsActive.active = true;
   }
   
   $scope.resetProfilePicture = function() {
      $scope.registrationUser.setProfilePicture(null);
   }
   
   $scope.onProfilePictureAdded = function(files) {
      PictureService.getPictureFromFileModel(files[0])
      .then(function(picture) {
         ProfilePictureService.resizeProfilePicture(picture)
         .then(function(newPicture) {
            $scope.registrationUser.setProfilePicture(newPicture);
         })
         .catch(function(error) {
            ErrorModal(error);
         })         
      });
   }
   
   $scope.onProfilePictureProgress = function(progress) {
      
   }
   
   $scope.onProfilePictureError = function(error) {
      ErrorModal(error);
   }
}]);

module.exports = name;