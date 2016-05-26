'use strict';

var registerController = require('controllers/register');
var utils = require('utils');

var name = 'controllers.root';

registerController(name, ['$rootScope',
                          require('services/error_modal'),
                          require('services/user_service'),
                          require('services/state_service'),
                          require('services/permission_service'),
                          require('services/error_page_service'),
function($rootScope, ErrorModal, UserService, StateService, PermissionService,
ErrorPageService) {
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
                emailChanged = utils.stringToBoolean(emailChanged);
                if (emailChanged) {
                    StateService.go('main.page.user.default', 
                        {userId: UserService.getCurrentUserId()});
                } else {
                    if (true === UserService.isLoggedIn()) {
                      StateService.go('main.page.user.default', 
                            {error: error})  
                    } else {
                       ErrorPageService.go(error);
                    }
                }
            }
        }
    });
    
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
       ErrorModal(error);
    });
    
    $rootScope.$on('$viewContentLoading', function(e, viewConfig) {       
    });
    
    $rootScope.$on('$viewContentLoaded', function(e) {
    });
}]);

module.exports = name;