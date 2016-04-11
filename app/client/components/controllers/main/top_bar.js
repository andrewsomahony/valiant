var registerController = require('controllers/register');

var name = 'controllers.main.top_bar';

registerController(name, ['$scope',
                          require('services/user_service'),
function($scope, UserService) {
    
    $scope.isLoggedIn = function() {
        return false;
    }

}]);

module.exports = name;