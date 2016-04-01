'use strict';

var registerController = require('../../register');
var utils = require('utils');

var name = 'main.about.default';

registerController(name, ['$scope', 
                          require('models/error'),
                          require('models/progress'),
                          require('services/error_modal'),
                          function($scope, ErrorModel, ProgressModel, ErrorModal) {
                              
    var e = new ErrorModel({
        text: "Error!!",
        code: -999
    });
    
    console.log(utils.objectIsClassy(e, ErrorModel));
    
    setTimeout(function() {
        $scope.$apply(function() {
            $scope.name = "Pearl";
            ErrorModal(e);
        })
    }, 1000);
}]);

module.exports = name;