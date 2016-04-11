'use strict';

var registerDirective = require('directives/register');

var name = 'facebookButton';

registerDirective(name, [require('services/facebook_service'),
                         require('services/user_service'),
                         require('services/promise'),
function(FacebookService, UserService, PromiseService) {
    return {
        restrict: 'E',
        scope: {
            
        },
        templateUrl: "directives/facebook_button.html",
        link: function($scope, $element, $attributes) {
            $scope.isLoggedIntoFacebook = function() {
                return FacebookService.isLoggedIn();
            }
            
            $scope.isLoggedIn = function() {
                return UserService.isLoggedIn();
            }
            
            $scope.facebookIsReady = function() {
                return FacebookService.isReady();
            }
            
            function FacebookLogin() {
                return PromiseService(function(resolve, reject, notify) {
                    FacebookService.login(['email', 'public_profile'])
                    .then(function() {
                        resolve();
                    })
                    .catch(function(e) {
                        reject(e);
                    });                    
                });                
            }
            
            $scope.connectToFacebook = function() {
                FacebookLogin()
                .then(function() {
                    UserService.connectToFacebook()
                    .then(function() {
                        
                    })
                    .catch(function(e) {
                        
                    });
                })
                .catch(function(e) {
                });
            }
            
            $scope.loginToFacebook = function() {
                FacebookLogin()
                .then(function() {
                    UserService.loginToFacebook()
                    .then(function() {
                        
                    })
                    .catch(function(e) {
                        
                    });
                })
                .catch(function(e) {
                    
                })
            }
            
            $scope.disconnectFromFacebook = function() {
                // !!! First disconnect user, then logout?
                FacebookService.logout()
                .then(function() {
                    UserService.disconnectFromFacebook()
                    .then(function() {
                        
                    })
                    .catch(function(e) {
                        
                    })
                })
                .catch(function(e) {
                    
                });
            }
        }
    }
}])

module.exports = name;