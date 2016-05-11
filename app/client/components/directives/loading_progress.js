'use strict';

var registerDirective = require('directives/register');

var utils = require('utils');

var name = 'loadingProgress';

registerDirective(name, ['$compile',
   function($compile) {
      return {
         restrict: 'E',
         scope: {
            //type: "@", (spinner, circle, image, bar)
            progressObject: "<",
            //width: "@",
            //height: "@",
            //imageUrl: "@",
            //color: "@"
         },
         template: "<div></div>",
         link: function($scope, $element, $attributes) {
            $scope.type = $attributes.type || "spinner";
            $scope.imageUrl = $attributes.imageUrl || null;
            
            $scope.width = $attributes.width || null;
            $scope.height = $attributes.height || null;
            
            $scope.color = $attributes.color || "blue";
            
            $scope.getLoadingBarParentStyle = function() {
               return {
                  'border-color': $scope.color,
                  'width': $scope.width,
                  'height': $scope.height
               }
            }
            
            $scope.getLoadingBarStyle = function() {
               if (!$scope.progressObject) {
                  return {
                     'width': "0px"
                  };
               } else {
                  return {
                     'width': utils.round(parseInt($scope.width) * $scope.progressObject.percentage(), 0) + "px",
                     'background-color': $scope.color,
                     'height': '100%'
                  };
               }
            }
            
            $scope.getSpinnerStyle = function() {
               var style = {};
               
               if ($scope.width) {
                  style['width'] = $scope.width;
               }
               if ($scope.height) {
                  style['height'] = $scope.height;
               }
               
               return style;
            }
            
            var $div = $element.children("div");
            
            $div.css('display', 'inline-block');
                        
            if ('spinner' === $scope.type) {
               var $imageElement = angular.element("<img />");
               $imageElement.attr('src', './images/spinner.gif');
               $imageElement.attr('ng-style', 'getSpinnerStyle()');

               $div.append($compile($imageElement)($scope));
            } else if ('circle' === $scope.type) {
               
            } else if ('image' === $scope.type) {
               
            } else if ('bar' === $scope.type) {
               var $barElement = angular.element("<div></div>");
               $barElement.attr('class', 'loading-bar-parent');
               $barElement.attr('ng-style', "getLoadingBarParentStyle()");
               
               var $loadingBarElement = angular.element("<div></div>");
               $loadingBarElement.attr('class', 'loading-bar');
               $loadingBarElement.attr('ng-style', "getLoadingBarStyle()");
               
               $barElement.append($loadingBarElement);
               
               $div.append($compile($barElement)($scope));
            }
         }
      };
   }
])

module.exports = name;