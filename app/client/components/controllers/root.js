'use strict';

var registerController = require('controllers/register');
var utils = require('utils');

var name = 'controllers.root';

registerController(name, ['$rootScope',
                          require('services/error_modal'),
                          require('services/user_service'),
                          require('services/state_service'),
                          '$location',
function($rootScope, ErrorModal, UserService, StateService, $location) {
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams, options) {
    });
    
    $rootScope.$on('$stateNotFound', function(e, unfoundState, fromState, fromParams) {        
    });
    
    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {               
        var emailVerified = toParams['email_verified'];
        if (false === utils.isUndefinedOrNull(emailVerified)) {
            if (emailVerified) {
                StateService.go('main.page.login.default', 
                            {verification_success: true});
            } else {
                //Do something
            }
        } 
    });
    
    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
        ErrorModal(error);
    });
    
    $rootScope.$on('$viewContentLoading', function(e, viewConfig) {       
    });
    
    $rootScope.$on('$viewContentLoaded', function(e) {
    });
}]);

module.exports = name;