'use strict';

var registerController = require('../../register');
var utils = require('utils');

var name = 'main.about.default';

registerController(name, ['$scope', 
                          require('services/error'),
                          require('models/progress'),
                          require('services/error_modal'),
                          function($scope, ErrorService, ProgressModel, ErrorModal) {
                              
    var e = ErrorService.localError("There's an error!");
    
    setTimeout(function() {
        $scope.$apply(function() {
            $scope.name = "Pearl";
            ErrorModal(e);
        })
    }, 1000);
}]);

module.exports = name;