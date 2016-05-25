'use strict';

var registerController = require('controllers/register');
var utils = require('utils');

var name = 'controllers.root';

registerController(name, ['$rootScope',
                          require('services/error_modal'),
                          require('services/user_service'),
                          require('services/state_service'),
                          require('services/permission_service'),
function($rootScope, ErrorModal, UserService, StateService, PermissionService) {
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams, options) {
    });
    
    $rootScope.$on('$stateNotFound', function(e, unfoundState, fromState, fromParams) {        
    });
    
    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {               
        if (true === PermissionService.stateRequiresLogin(toState.name) &&
            false === UserService.isLoggedIn()) {
            StateService.go('main.page.login.default', 
                        {requires_login: true});
        } else if (true === PermissionService.stateHiddenWithLogin(toState.name) &&
                   true === UserService.isLoggedIn()) {
            StateService.go('main.page.user.default',
                     {userId: UserService.getCurrentUserId()});        
        } else {
            var emailVerified = toParams['email_verified'];
            var error = toParams['error'] || "";
            
            if (false === utils.isUndefinedOrNull(emailVerified)) {
                emailVerified = utils.stringToBoolean(emailVerified);
                if (emailVerified) {
                    StateService.go('main.page.login.default', 
                                {verification_success: true});
                } else {
                    StateService.go('main.page.login.default',
                    {verification_success: false, 
                        error: error});
                }
            }
            
            var resetPasswordToken = toParams['reset_password_token'];
            if (false === utils.isUndefinedOrNull(resetPasswordToken)) {
                StateService.go('main.page.reset_password.default',
                {token: resetPasswordToken});
            }
            
            var emailChanged = toParams['email_changed'];
            if (false === utils.isUndefinedOrNull(emailChanged)) {
                if (emailChanged) {
                    StateService.go('main.page.user.default');
                } else {
                    // We need to redirect to some sort of a default
                    // error page here.
                    throw new Error("Cannot change e-mail!");
                    //StateService.go('main.page.user.default')
                }
            }
        }
    });
    
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        // We can handle this a few ways...
        
        /*if ('main.page.user.default' === toState.name) {
            if (403 === error.code) {
                // We tried to access a user we don't have permission to access
            }
        } else {*/
            ErrorModal(error);
        //}
    });
    
    $rootScope.$on('$viewContentLoading', function(e, viewConfig) {       
    });
    
    $rootScope.$on('$viewContentLoaded', function(e) {
    });
}]);

module.exports = name;