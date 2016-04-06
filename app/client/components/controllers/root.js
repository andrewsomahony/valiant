'use strict';

var registerController = require('controllers/register');

var name = 'controllers.root';

registerController(name, ['$rootScope',
                          require('services/error_modal'),
function($rootScope, ErrorModal) {
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
}]);

module.exports = name;