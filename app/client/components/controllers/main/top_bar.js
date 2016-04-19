var registerController = require('controllers/register');

var name = 'controllers.main.top_bar';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
                          require('services/state_service'),
function($scope, UserService, ErrorModal, StateService) {
    
    $scope.isLoggedIn = function() {
        return UserService.isLoggedIn();
    }
    
    $scope.getLoggedInUser = function() {
        return UserService.getCurrentUser();
    }
    
    $scope.getFullName = function() {
        return this.getLoggedInUser().fullName();
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