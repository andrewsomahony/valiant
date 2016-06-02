'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.user.default';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('models/user'),
                          require('services/state_service'),
                          require('services/profile_picture_service'),
                          require('services/picture_service'),
                          require('services/file_reader_activator_service'),
function($scope, UserService, UserModel, StateService,
ProfilePictureService, PictureService,
FileReaderActivatorService) {
   // Clone what we get from the UserService
   // to allow for editing and such
   
   $scope.currentEditingUser = 
      !UserService.getCurrentRequestedUser() ? 
      null :
      UserService.getCurrentRequestedUser().clone();
   
   $scope.previousEditingUser = null;
   
   $scope.profilePicturePicker = FileReaderActivatorService.makeCreationObject();
   /*{
      active: false
   };*/
   
   $scope.tempWidth = "40%";
   $scope.tempHeight = "40%";
   
   $scope.isEditingProfile = false;
   $scope.isChangingPassword = false;
   $scope.isChangingEmail = false;
   
   $scope.isSaving = false;
   $scope.savingMessage = "";
   
   $scope.postSavingMessage = "";
   
   $scope.errorMessage = StateService.params()['error'];
   
   $scope.savingProgress = null;
   
   $scope.passwordChangeData = {
      old_password: "",
      new_password: "",
      new_password_repeat: ""
   };
   
   $scope.emailChangeData = {
      email: ""
   };
   
   $scope.error = function(errorObject) {
      if (!errorObject) {
         $scope.errorMessage = "";      
      } else {
         $scope.errorMessage = errorObject.toString(false);
      }
   }
      
   $scope.isViewingLoggedInUser = function() {
      if (!this.currentEditingUser) {
         return false;
      }
      
      var currentUser = UserService.getCurrentUser();
      
      return currentUser && currentUser.id === $scope.currentEditingUser.id;
   }
   
   $scope.setIsSaving = function(isSaving, message) {
      $scope.isSaving = isSaving;
      if (isSaving) {
         $scope.savingMessage = message || "Saving...";
      } else {
         $scope.savingMessage = "";
      }
   }
   
   $scope.setPostSavingMessage = function(message) {
      $scope.postSavingMessage = message;
   }
   
   $scope.finishEditing = function(newUser) {
      $scope.currentEditingUser = newUser;
      $scope.previousEditingUser = null;
   }
   
   $scope.canChangeUser = function() {
      return this.isViewingLoggedInUser();
   }
   
   $scope.getSavingUserMessage = function() {
      return $scope.savingMessage || "Saving...";
   }
   
   $scope.getEmailEditControlClass = function() {
      if ($scope.currentEditingUser.pending_email) {
         return "";
      } else {
         return "top-edit-control";
      }
   }
   
   $scope.saveProfile = function() {
      $scope.setIsSaving(true);
      $scope.setPostSavingMessage(null);
      
      UserService.saveUser($scope.currentEditingUser,
                  $scope.previousEditingUser)
      .then(function(newUser) {
         $scope.finishEditing(newUser);
         $scope.isEditingProfile = false;
         $scope.error(null);
      }, null, function(progress) {
         $scope.savingProgress = progress;
      })
      .catch(function(e) {
         $scope.error(e);
      })
      .finally(function() {
         $scope.setIsSaving(false);
      })
   }
   
   $scope.changePassword = function() {
      $scope.setIsSaving(true, "Changing password...");
      $scope.setPostSavingMessage(null);
      
      UserService.changePassword($scope.passwordChangeData.old_password,
            $scope.passwordChangeData.new_password)
      .then(function(newUser) {
         $scope.finishEditing(newUser);
         $scope.setPostSavingMessage("Password changed successfully");
         $scope.clearPasswordFields();
      })
      .catch(function(error) {
         $scope.error(error);
      })
      .finally(function() {
         $scope.setIsSaving(false);
      })
   }
   
   $scope.changeEmail = function() {
      $scope.setIsSaving(true, "Changing E-mail...");
      $scope.setPostSavingMessage(null);
      
      UserService.changeEmail($scope.emailChangeData.email)
      .then(function(newUser) {
         $scope.finishEditing(newUser);
         $scope.setPostSavingMessage("Success.  Check the new e-mail address for further instructions.");
         $scope.clearEmailFields();
      }, null, function(progress) {
         $scope.savingProgress = progress;
      })
      .catch(function(error) {
         $scope.error(error);
      })
      .finally(function() {
         $scope.setIsSaving(false);
      });
   }
   
   $scope.resendPendingEmailVerificationEmail = function() {
      $scope.setIsSaving(true, "Resending...");
      
      UserService.resendPendingEmailVerificationEmail($scope.currentEditingUser)
      .then(function(newUser) {
         $scope.currentEditingUser = newUser;
         $scope.setPostSavingMessage("Verification e-mail resent");                 
      })
      .catch(function(error) {
         $scope.error(error);
      })
      .finally(function() {
         $scope.setIsSaving(false);
      })
   }
   
   $scope.cancelPendingEmailVerification = function() {
      $scope.setIsSaving(true, "Cancelling...");
      
      UserService.cancelPendingEmailVerification($scope.currentEditingUser)
      .then(function(newUser) {
         $scope.currentEditingUser = newUser;
      })
      .catch(function(error) {
         $scope.error(error);
      })
      .finally(function() {
         $scope.setIsSaving(false);
      });
   }
     
   $scope.changeProfilePicture = function() {
      FileReaderActivatorService.activateFileReader($scope.profilePicturePicker);
      //$scope.profilePicturePickerIsActive.active = true;
   }
   
   $scope.resetProfilePicture = function() {
      $scope.currentEditingUser.setProfilePicture(null);
   }
      
   $scope.onProfilePictureSelectCreated = function(elementId) {
      console.log("NEW ELEMENT ID", elementId);
      FileReaderActivatorService.fileReaderCreated($scope.profilePicturePicker, elementId);
   }
   
   $scope.onProfilePictureSelectSuccess = function(files) {
      PictureService.getPictureFromFileModel(files[0])
      .then(function(picture) {
         ProfilePictureService.resizeProfilePicture(picture)
         .then(function(newPicture) {
            $scope.currentEditingUser.setProfilePicture(newPicture);
         })
         .catch(function(error) {
            $scope.error(error);
         });         
      });
   }
   
   $scope.onProfilePictureSelectError = function(error) {
      $scope.error(error);
   }
   
   $scope.onProfilePictureSelectProgress = function(progress) {
      
   }
   
   $scope.clearPasswordFields = function() {
      $scope.passwordChangeData.old_password = "";
      $scope.passwordChangeData.new_password = "";
      $scope.passwordChangeData.new_password_repeat = "";      
   }
   
   $scope.clearEmailFields = function() {
      $scope.emailChangeData.email = "";      
   }
   
   $scope.activateEditing = function() {
      FileReaderActivatorService.createFileReader($scope.profilePicturePicker);   
      $scope.previousEditingUser = $scope.currentEditingUser.clone();
   }
   
   $scope.activateEditingProfile = function() {
      $scope.isEditingProfile = true;
      $scope.activateEditing();
   }
   
   $scope.activateChangePassword = function() {
      $scope.isChangingPassword = true;
      $scope.clearPasswordFields();

      $scope.activateEditing();
   }
   
   $scope.activateChangeEmail = function() {
      $scope.isChangingEmail = true;
      $scope.clearEmailFields();
      
      $scope.activateEditing();
   }
   
   $scope.cancelEditing = function() {
      $scope.currentEditingUser = $scope.previousEditingUser;
      $scope.previousEditingUser = null;
      
      $scope.isEditingProfile = false;
      $scope.setPostSavingMessage(null);
   }
   
   $scope.cancelChangePassword = function() {
      $scope.isChangingPassword = false;
      $scope.setPostSavingMessage(null);
   }
   
   $scope.cancelChangeEmail = function() {
      $scope.isChangingEmail = false;
      $scope.setPostSavingMessage(null);
   }
   
   $scope.getStaticErrorMessage = function() {
      if ($scope.currentEditingUser) {
         return "";
      } else {
         if (UserService.currentRequestedUserIsNotAccessible()) {
            return "You don't have permission to view this user."   
         } else if (UserService.currentRequestedUserIsNotFound()) {
            return "User not found."   
         } else {
            return "Unknown error";   
         }
      }
   }
}]);

module.exports = name;