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
                          require('services/confirm_modal_service'),
                          require('services/api_url'),
                          require('services/user_service'),
function($scope, ErrorService, Progress, HttpResponseModel, 
ErrorModal, HttpService, ConfirmModal, ApiUrlService, UserService) {
    $scope.onTestRequestClick = function() {
        HttpService.get('/api/users')
        .then(function(response) {
            console.log(response.data);
        })
        .catch(function(error) {
            ErrorModal(error);
        });
    }

    $scope.englandVariable = "Did England win?";

    $scope.england = function() {
        ErrorModal("No they didn't");
    }
    
    $scope.testProgressModel = Progress(0, 100);
    
    var interval = setInterval(function() {
        $scope.$apply(function() {
            $scope.testProgressModel.current += 1;
        });
        
        if (100 === $scope.testProgressModel.current) {
           clearInterval(interval);
           
           $scope.$apply(function() {
               $scope.name = "Pearl";
           })
        }
    }, 10);

}]);

module.exports = name;