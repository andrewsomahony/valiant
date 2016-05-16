'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.user.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('models/user'),
                          require('services/error_modal'),
                          require('services/profile_picture_service'),
function($scope, UserService, UserModel, ErrorModal,
ProfilePictureService) {
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
   
   $scope.isEditingProfile = false;
   $scope.isChangingPassword = false;
   $scope.isChangingEmail = false;
   
   $scope.isSaving = false;
   
   $scope.hasChangedEmail = false;
   
   $scope.savingProgress = null;
   
   $scope.passwordChangeData = {
      old_password: "",
      new_password: "",
      new_password_repeat: ""
   };
   
   $scope.emailChangeData = {
      email: ""
   };
      
   $scope.isViewingLoggedInUser = function() {
      if (!this.currentEditingUser) {
         return false;
      }
      
      var currentUser = UserService.getCurrentUser();
      
      return currentUser.id === $scope.currentEditingUser.id;
   }
   
   $scope.canChangeUser = function() {
      return this.isViewingLoggedInUser();
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
         $scope.isEditingProfile = false;
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
   
   $scope.changeEmail = function() {
      $scope.isSaving = true;
      
      UserService.changeEmail($scope.emailChangeData.email)
      .then(function(newUser) {
         $scope.currentEditingUser = newUser;
         $scope.previousEditingUser = null;
         $scope.isEditingProfile = false;
      }, null, function(progress) {
         $scope.savingProgress = progress;
      })
      .catch(function(error) {
         ErrorModal(error);
      })
      .finally(function() {
         $scope.isSaving = false;
      });
   }
     
   $scope.changeProfilePicture = function() {
      $scope.profilePicturePickerIsActive.active = true;
   }
   
   $scope.resetProfilePicture = function() {
      $scope.currentEditingUser.setProfilePictureFile(null);
   }
   
   $scope.onProfilePictureSelectSuccess = function(files) {
      ProfilePictureService.resizeProfilePictureFromFileModel(files[0])
      .then(function(fileModel) {
         $scope.currentEditingUser.setProfilePictureFile(fileModel);
      })
      .catch(function(error) {
         ErrorModal(e);
      })
   }
   
   $scope.onProfilePictureSelectError = function(error) {
      
   }
   
   $scope.onProfilePictureSelectProgress = function(progress) {
      
   }
   
   $scope.activateEditing = function() {
      $scope.isEditingProfile = true;
      $scope.previousEditingUser = $scope.currentEditingUser.clone();
   }
   
   $scope.activateChangePassword = function() {
      $scope.isChangingPassword = true;

      $scope.passwordChangeData.old_password = "";
      $scope.passwordChangeData.new_password = "";
      $scope.passwordChangeData.new_password_repeat = "";
   }
   
   $scope.activateChangeEmail = function() {
      $scope.isChangingEmail = true;
      
      $scope.emailChangeData.email = "";
   }
   
   $scope.cancelEditing = function() {
      $scope.currentEditingUser = $scope.previousEditingUser;
      
      $scope.previousEditingUser = null;
      
      $scope.isEditingProfile = false;
   }
   
   $scope.cancelChangePassword = function() {
      $scope.isChangingPassword = false;
   }
   
   $scope.cancelChangeEmail = function() {
      $scope.isChangingEmail = false;
   }
}]);

module.exports = name;