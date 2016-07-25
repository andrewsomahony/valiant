var registerController = require('controllers/register');

var name = 'controllers.main.top_bar';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
                          require('services/state_service'),
                          require('services/scope_service'),
                          '$popover',
function($scope, UserService, ErrorModal, StateService, 
ScopeService, $popover) {
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

}]);

module.exports = name;