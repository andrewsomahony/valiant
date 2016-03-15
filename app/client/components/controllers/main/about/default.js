'use strict';

var registerController = require('../../register');
var utils = require('utils');

var name = 'main.about.default';

registerController(name, ['$scope', 
                          require('models/error'),
                          require('models/progress'),
                          function($scope, ErrorModel, ProgressModel) {
                              
    var e = new ErrorModel({
        error: "Nothing",
        code: -999
    });

    console.log(utils.objectIsTypeOfClass(e, ErrorModel);
    
    setTimeout(function() {
        $scope.$apply(function() {
            $scope.name = "Pearl";
        })
    }, 1000);
}]);

module.exports = name;