'use strict';

var registerController = require('controllers/register');

var name = 'controllers.root';

registerController(name, ['$rootScope',
                          require('services/error_modal'),
                          require('services/facebook_service'),
function($rootScope, ErrorModal, FacebookService) {
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams, options) {
    });
    
    $rootScope.$on('$stateNotFound', function(e, unfoundState, fromState, fromParams) {        
    });
    
    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {        
    });
    
    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
        ErrorModal(error);
    });
    
    $rootScope.$on('$viewContentLoading', function(e, viewConfig) {
        
    });
    
    $rootScope.$on('$viewContentLoaded', function(e) {
        
    });
    
    $rootScope.$on('Facebook:load', function() {
        console.log("Facebook loaded");
        FacebookService.getLoginStatus();
    });
    
   /* $rootScope.$on('Facebook:statusChange', function(e, response) {
        console.log("Status change");
        if (!response || response.error) {
            console.log("FACEBOOK ERROR", response.error);
        } else {
            console.log("statusChange: ", response);
            FacebookService.parseLoginStatusResponse(response);
            FacebookService.setIsReady(true);
        }
    });*/
}]);

module.exports = name;