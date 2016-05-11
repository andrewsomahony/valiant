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
   
   $scope.profilePicturePickerActive = {
      active: false
   };
   
   $scope.isEditing = false;
   
   $scope.isViewingLoggedInUser = function() {
      if (!this.currentEditingUser) {
         return false;
      }
      
      var currentUser = UserService.getCurrentUser();
      
      return currentUser.id === $scope.currentEditingUser.id;
   }
   
   $scope.saveProfile = function() {
      
   }
     
   $scope.changeProfilePicture = function() {
      
   }
   
   $scope.resetProfilePicture = function() {
      
   }
   
   $scope.onProfilePictureChangeSuccess = function(files) {
      
   }
   
   $scope.onProfilePictureChangeError = function(error) {
      
   }
   
   $scope.onProfilePictureChangeProgress = function(progress) {
      
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