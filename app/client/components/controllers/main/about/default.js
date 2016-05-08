'use strict';

var registerController = require('../../register');
var utils = require('utils');

var name = 'controllers.main.about.default';

registerController(name, ['$scope', 
                          require('services/error'),
                          require('models/progress'),
                          require('models/http_response'),
                          require('services/error_modal'),
                          require('services/http_service'),
function($scope, ErrorService, ProgressModel, HttpResponseModel, ErrorModal, HttpService) {
                                  
    setTimeout(function() {
        $scope.$apply(function() {
            $scope.name = "Pearl";
        })
    }, 1000);
    
    $scope.onTestRequestClick = function() {
        HttpService.get('/api/users')
        .then(function(response) {
            console.log(response.data);
        })
        .catch(function(error) {
            ErrorModal(error);
        });
    }

}]);

module.exports = name;