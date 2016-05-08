'use strict';

var registerDirective = require('directives/register');

var name = 'compareTo';

registerDirective(name, [function() {
   return {
      restrict: 'A',
      require: "ngModel",
      scope: {
         otherValue: "=compareTo"
      },
      link: function($scope, $element, $attributes, $modelController) {
         $modelController.$validators.compareTo = function(modelValue, viewValue) {
            console.log(modelValue, viewValue, $scope.otherValue);
            return modelValue === $scope.otherValue;
         }
         
         $scope.$watch('otherValue', function() {
            $modelController.$validate();
         })
      }
   };
}]);

module.exports = name;