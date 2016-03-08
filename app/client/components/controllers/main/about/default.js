'use strict';

var registerController = require('../../register');

var name = 'main.about.default';

registerController(name, ['$scope', function($scope) {
    setTimeout(function() {
        $scope.$apply(function() {
            $scope.name = "Pearl";
        })
    }, 1000);
}]);

module.exports = name;