'use strict';

var registerController = require('../../register');
var utils = require('utils');

var name = 'controllers.main.about.default';

registerController(name, ['$scope', 
                          require('services/error'),
                          require('services/progress'),
                          require('models/http_response'),
                          require('services/error_modal'),
                          require('services/http_service'),
function($scope, ErrorService, Progress, HttpResponseModel, ErrorModal, HttpService) {
    $scope.onTestRequestClick = function() {
        HttpService.get('/api/users')
        .then(function(response) {
            console.log(response.data);
        })
        .catch(function(error) {
            ErrorModal(error);
        });
    }
    
    $scope.testProgressModel = Progress(0, 100);
    
    var interval = setInterval(function() {
        $scope.$apply(function() {
            $scope.testProgressModel.current += 1;
        });
        
        
        if ($scope.testProgressModel.current === 100) {
           clearInterval(interval);
           
           $scope.$apply(function() {
               $scope.name = "Pearl";
           })
        }
    }, 10);

}]);

module.exports = name;