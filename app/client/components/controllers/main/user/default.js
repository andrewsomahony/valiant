'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.user.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('models/user'),
                          require('services/error_modal'),
function($scope, UserService, UserModel, ErrorModal) {
   // Clone what we get from the UserService
   // to allow for editing and such
   
   $scope.currentEditingUser = 
      UserService.currentRequestedUserIsNotAccessible() ? 
      null :
      UserService.getCurrentRequestedUser().clone();
   
   $scope.previousEditingUser = null;
   
   $scope.profilePicturePickerIsActive = {
      active: false
   };
   
   $scope.isEditing = false;
   $scope.isChangingPassword = false;
   $scope.isSaving = false;
   
   $scope.savingProgress = null;
   
   $scope.passwordChangeData = {
      old_password: "",
      new_password: "",
      new_password_repeat: ""
   };
      
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
         return $scope.savingProgress.message || "Saving...";
      }
   }
   
   $scope.saveProfile = function() {
      $scope.isSaving = true;
      
      UserService.saveUser($scope.currentEditingUser,
                  $scope.previousEditingUser)
      .then(function(newUser) {
         $scope.currentEditingUser = newUser;
         $scope.previousEditingUser = null;
         $scope.isEditing = false;
      }, null, function(progress) {
         $scope.savingProgress = progress;
      })
      .catch(function(e) {
         ErrorModal(e);
      })
      .finally(function() {
         $scope.isSaving = false;
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
      $scope.previousEditingUser = $scope.currentEditingUser.clone();
   }
   
   $scope.activateChangePassword = function() {
      $scope.isChangingPassword = true;

      $scope.passwordChangeData.old_password = "";
      $scope.passwordChangeData.new_password = "";
      $scope.passwordChangeData.new_password_repeat = "";
   }
   
   $scope.cancelEditing = function() {
      $scope.currentEditingUser = $scope.previousEditingUser;
      
      $scope.previousEditingUser = null;
      
      $scope.isEditing = false;
   }
   
   $scope.cancelChangePassword = function() {
      $scope.isChangingPassword = false;
   }
}]);

module.exports = name;