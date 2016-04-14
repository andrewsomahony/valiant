var registerController = require('controllers/register');

var name = 'controllers.main.top_bar';

registerController(name, ['$scope',
                          require('services/user_service'),
                          require('services/error_modal'),
function($scope, UserService, ErrorModal) {
    
    $scope.isLoggedIn = function() {
        return UserService.isLoggedIn();
    }
    
    $scope.logout = function() {
        UserService.logout()
        .then(function() {
            
        })
        .catch(function(error) {
            ErrorModal(error);
        })
    }

}]);

module.exports = name;