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
function($scope, UserService, ErrorModal, 
UserModel, StateService, SerialPromise, Promise, ProgressService) {
   $scope.registrationUser = new UserModel();
   
   $scope.registrationInProgress = false;
   
   $scope.profilePicturePickerIsActive = {
      active: false
   };
   
   $scope.registrationProgress = null;
      
   $scope.registerUser = function() {
      $scope.registrationInProgress = true;
      
      var promiseFnArray = [];
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         return UserService.uploadProfilePicture($scope.registrationUser, forNotify);
      })

      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return UserService.registerUser($scope.registrationUser);
         }
      });
      
      SerialPromise.withNotify(promiseFnArray)
      .then(function() {
         StateService.go('^.success');
      }, null, function(progress) {
         $scope.registrationProgress = progress;
         console.log("REGISTER PROGRESS", progress);
      })
      .catch(function(e) {
         ErrorModal(e);
      })
      .finally(function() {
         $scope.registrationInProgress = false;
      })
   }
   
   $scope.selectProfilePicture = function() {
      $scope.profilePicturePickerIsActive.active = true;
   }
   
   $scope.onProfilePictureAdded = function(files) {
      $scope.registrationUser.setProfilePictureFile(files[0]);
   }
   
   $scope.onProfilePictureProgress = function(progress) {
      
   }
   
   $scope.onProfilePictureError = function(error) {
      ErrorModal(error);
   }
}]);

module.exports = name;