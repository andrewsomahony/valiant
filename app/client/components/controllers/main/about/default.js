'use strict';

var registerController = require('../../register');
var utils = require('utils');

var name = 'main.about.default';

registerController(name, ['$scope', 
                          require('services/error'),
                          require('models/progress'),
                          require('models/http_response'),
                          require('services/error_modal'),
                          require('services/http_service'),
                          require('services/facebook_service'),
function($scope, ErrorService, ProgressModel, HttpResponseModel, ErrorModal, Http, FacebookService) {
                                  
    setTimeout(function() {
        $scope.$apply(function() {
            $scope.name = "Pearl";
        })
    }, 1000);
    
    $scope.onTestRequestClick = function() {
        Http.get('/api/users')
        .then(function(response) {
            console.log(response.data);
        })
        .catch(function(error) {
            ErrorModal(error);
        });
    }

}]);

module.exports = name;