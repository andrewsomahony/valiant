var registerController = require('controllers/register');

var utils = require('utils');

var name = 'controllers.main.top_bar';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
                          require('services/state_service'),
                          require('models/notification'),
                          '$timeout',
function($scope, UserService, ErrorModal, StateService, 
NotificationModel, $timeout) {
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

    $scope.notificationsOpened = function() {
       // We're doing this set here for interface
       // responsiveness: give it a chance to recompile
       // before we make the request.

       var newNotifications = $scope.getLoggedInUser().getNewNotifications();
       var clonedNotifications = NotificationModel.cloneArray(newNotifications);

       newNotifications
       .forEach(function(n) {
           n.is_new = false;
       });

       // We can pass any array we want, the mark functions
       // automatically will update the logged in user, and whatever
       // user we pass in.

       $timeout(function() {
          UserService.markNotificationsAsOld($scope.getLoggedInUser(), clonedNotifications)
          .catch(function(error) {
             // Silent fail: the user will see the notification number not updating
             NotificationModel.rollback(newNotifications, clonedNotifications);
          });
       });
    }

    $scope.notificationsClosed = function() {
    }

    $scope.showingNotificationsButton = true;

    function ProcessCheckChange(newUser) {
       // No change animation currently
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
       
       UserService.check(previousUser, true)
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