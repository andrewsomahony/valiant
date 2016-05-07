'use strict';

var registerDirective = require('directives/register');

var name = 'loadingProgress';

registerDirective(name, [
   function() {
      return {
         restrict: 'E',
         scope: {
            //type: "@", (spinner, circle, image, bar)
            progressObject: "<",
            //width: "@",
            //height: "@",
            //imageUrl: "@"
         },
         template: "<div></div>",
         link: function($scope, $element, $attributes) {
            $scope.type = $scope.$eval($attributes.type) || "spinner";
            $scope.imageUrl = $scope.$eval($attributes.imageUrl) || "";
            
            $scope.width = eval($attributes.width || null);
            $scope.height = eval($attributes.height || null);
            
            var $div = $element.children("div");
            
            $div.css('display', 'inline');
            
            if ('spinner' === $scope.type) {
               var $imageElement = angular.element("<img />");
               $imageElement.attr('src', './images/spinner.gif');
               
               if ($scope.width) {
                  $imageElement.css('width', $scope.width + "px");
               }
               if ($scope.height) {
                  $imageElement.css('height', $scope.height + "px");
               }

               $div.append($imageElement);
            } else if ('circle' === $scope.type) {
               
            } else if ('image' === $scope.type) {
               
            } else if ('bar' === $scope.type) {
               
            }
         }
      };
   }
])

module.exports = name;