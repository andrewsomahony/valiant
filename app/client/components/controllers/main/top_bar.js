var registerController = require('controllers/register');

var name = 'controllers.main.top_bar';

registerController(name, ['$scope',
function($scope) {
    $scope.loginDetails = {
        username: "",
        password: ""
    };
    
    $scope.formVisible = false;
    
    $scope.showForm = function() {
        $scope.formVisible = true;
    }
}]);

module.exports = name;