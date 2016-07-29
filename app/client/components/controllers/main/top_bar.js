var registerController = require('controllers/register');

var name = 'controllers.main.top_bar';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
                          require('services/state_service'),
                          '$timeout',
function($scope, UserService, ErrorModal, StateService, 
$timeout) {
    $scope.isLoggedIn = function() {
        return UserService.isLoggedIn();
    }
    
    $scope.getLoggedInUser = function() {
        return UserService.getCurrentUser();
    }
    
    $scope.getFirstName = function() {
        return this.getLoggedInUser().first_name;
    }
    
    $scope.getUserId = function() {
        return this.getLoggedInUser().id;
    }
    
    $scope.logout = function() {
        UserService.logout()
        .then(function() {
            StateService.go('main.page.home.default');
        })
        .catch(function(error) {
            ErrorModal(error);
        });
    }

    $scope.showingNotificationsButton = true;

    function ProcessCheckChange(newUser) {
       var user = $scope.getLoggedInUser();

       if (newUser.getUnreadNotifications().length !=
           user.getUnreadNotifications().length) {
           $scope.showingNotificationsButton = false;
           $timeout(function() {
               UserService.updateCurrentAndRequestedUsersIfSame(newUser);
               $scope.showingNotificationsButton = true;
           }, 700);
       } else {
           UserService.updateCurrentAndRequestedUsersIfSame(newUser);
       }
    }

    function SetCheckTimeout() {
      var checkInterval = 10000;

      $timeout(function() {
         CheckUser();
      }, checkInterval);
    }

    function CheckUser() {
       var previousUser = $scope.getLoggedInUser().clone();

       // Tell the service not to update the current user
       // as we want to do some sort of animation to show
       // the notification change.
       
       UserService.check(previousUser, false)
       .then(function() {
          ProcessCheckChange(previousUser);
          SetCheckTimeout();
       })    
       .catch(function(error) {
       })
    }

    SetCheckTimeout();
}]);

module.exports = name;