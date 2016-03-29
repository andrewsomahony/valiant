'use strict';

var registerController = require('../../register');
var utils = require('utils');

var name = 'main.about.default';

registerController(name, ['$scope', 
                          require('models/error'),
                          require('models/progress'),
                          require('services/video_converter'),
                          function($scope, ErrorModel, ProgressModel, VideoConverter) {
                              
    var e = new ErrorModel({
        error: "Nothing",
        code: -999
    });

    console.log(utils.objectIsClassy(e, ErrorModel));
    
    setTimeout(function() {
        $scope.$apply(function() {
            $scope.name = "Pearl";
            VideoConverter.convert();
        })
    }, 1000);
}]);

module.exports = name;