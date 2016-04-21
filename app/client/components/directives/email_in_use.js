'use strict';

var registerDirective = require('directives/register');

var name = 'emailInUse';

registerDirective(name, [require('services/promise'),
                         require('services/http_service'),
                         require('services/api_url'),
function(PromiseService, HttpService, ApiUrlService) {
   return {
     require: "ngModel",
     restrict: 'A',
     link: function($scope, $element, $attributes, $modelController)  {
        $modelController.$asyncValidators.emailInUse = function(modelValue, viewValue) {
           if (!modelValue) {
              return true;
           }
           
           return PromiseService(function(resolve, reject, notify) {
              HttpService.get(ApiUrlService([{name: 'User'},
                                             {name: 'Register'}, 
                                             {name: 'EmailAvailable'}]),
                                             {email: modelValue})
              .then(function() {
                 reject();
              })
              .catch(function() {
                 resolve();
              })
           });
        }
     } 
   };
}]);

module.exports = name;