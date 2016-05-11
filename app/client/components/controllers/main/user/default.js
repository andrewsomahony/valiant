'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.user.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('models/user'),
function($scope, UserService, UserModel) {
   // Clone what we get from the UserService
   // to allow for editing and such
   
   $scope.currentEditingUser = 
      UserService.currentRequestedUserIsNotAccessible() ? 
      null :
      UserService.getCurrentRequestedUser().clone();
   
   $scope.profilePicturePickerIsActive = {
      active: false
   };
   
   $scope.isEditing = false;
   $scope.isSaving = false;
   
   $scope.savingProgress = null;
      
   $scope.isViewingLoggedInUser = function() {
      if (!this.currentEditingUser) {
         return false;
      }
      
      var currentUser = UserService.getCurrentUser();
      
      return currentUser.id === $scope.currentEditingUser.id;
   }
   
   $scope.getSavingUserMessage = function() {
      if (!$scope.savingProgress) {
         return "Saving...";
      } else {
         return $scope.savingProgress || "Saving...";
      }
   }
   
   $scope.saveProfile = function() {
      $scope.isSaving = true;
      
      UserService.saveUser($scope.currentEditingUser)
      .then(function() {
         $scope.currentEditingUser = UserService.getCurrentRequestedUser().clone();
      }, null, function(progress) {
         $scope.savingProgress = progress;
      })
      .catch(function(e) {
         ErrorModal(e);
      })
      .finally(function() {
         $scope.isSaving = false;
         $scope.isEditing = false;
      })
   }
     
   $scope.changeProfilePicture = function() {
      $scope.profilePicturePickerIsActive.active = true;
   }
   
   $scope.resetProfilePicture = function() {
      $scope.currentEditingUser.setProfilePictureFile(null);
   }
   
   $scope.onProfilePictureSelectSuccess = function(files) {
      $scope.currentEditingUser.setProfilePictureFile(files[0]);
   }
   
   $scope.onProfilePictureSelectError = function(error) {
      
   }
   
   $scope.onProfilePictureSelectProgress = function(progress) {
      
   }
   
   $scope.activateEditing = function() {
      $scope.isEditing = true;
   }
   
   $scope.cancelEditing = function() {
      $scope.currentEditingUser = 
         UserService.getCurrentRequestedUser().clone();
      $scope.isEditing = false;
   }
}]);

module.exports = name;