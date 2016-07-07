'use strict';

var registerController = require('controllers/register');
var utils = require('utils');
var dom_utils = require('dom_utils');

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
                
            if (StateService.hasState('^.unauthorized')) {
               StateService.go('^.unauthorized');
            } else {
               StateService.go('main.login', 
                           {requires_login: true});
            }
        } else if (true === PermissionService.stateHiddenWithLogin(toState.name) &&
                   true === UserService.isLoggedIn()) {
            StateService.go('main.user',
                     {userId: UserService.getCurrentUserId()});        
        } else {
            var emailVerified = toParams['email_verified'];
            var error = toParams['error'] || "";
            
            if (false === utils.isUndefinedOrNull(emailVerified)) {
                emailVerified = utils.stringToBoolean(emailVerified);
                if (emailVerified) {
                    StateService.go('main.login', 
                                {verification_success: true});
                } else {
                    StateService.go('main.login',
                    {verification_success: false, 
                        error: error});
                }
            }

            var resetPassword = toParams['reset_password'];
            
            if (false === utils.isUndefinedOrNull(resetPassword)) {
                resetPassword = utils.stringToBoolean(resetPassword);
                if (true === resetPassword) {
                   var token = toParams['token'];
                   if (!token) {
                      ErrorPageService.go("Missing reset password token!");
                   } else {
                      StateService.go('main.reset_password',
                          {token: token});
                   }
                } else {
                   var error = toParams['error'];
                   ErrorPageService.go(error);
                }
            }
            
            var emailChanged = toParams['email_changed'];
            if (false === utils.isUndefinedOrNull(emailChanged)) {
                emailChanged = utils.stringToBoolean(emailChanged);
                if (emailChanged) {
                    StateService.go('main.user', 
                        {userId: UserService.getCurrentUserId()});
                } else {
                    if (true === UserService.isLoggedIn()) {
                      StateService.go('main.user', 
                            {error: error, userId: UserService.getCurrentUserId()});  
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
        dom_utils.findElementByClassName('.mobile-scroll').scrollTop = 1;
    });
}]);

module.exports = name;