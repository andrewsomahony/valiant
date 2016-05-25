'use strict';

var registerDirective = require('directives/register');

var utils = require('utils');

var name = 'loadingProgress';

registerDirective(name, ['$compile',
                         require('services/css_service'),
   function($compile, CSSService) {
      return {
         restrict: 'E',
         scope: {
            //type: "@", (spinner, circle, pie, image, bar)
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
            
            // Returns number from 0-100
            $scope.getLoadingPercentageAsInt = function() {
               return utils.round($scope.progressObject.percentage() * 100, 0)
            }
            
            $scope.getCircleDegrees = function() {
               return utils.round(360 * $scope.progressObject.percentage(), 0);
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
            
            $scope.getCircleRootStyle = function() {
               var style = {};
               
               if ($scope.width) {
                  style['font-size'] = $scope.width;
               }
               if ($scope.height) {
                  style['font-size'] = $scope.height;
               }
               
               return style;
            }
            
            $scope.getCircleSliceClass = function() {
               // .slice
               
               var percent = $scope.getLoadingPercentageAsInt();
               
               if (percent > 50) {
                  return ["gt50"];
               } else {
                  return [];
               }
            }
            
            $scope.getFilledCirclePieStyle = function() {
               // .timer.fill > .slice > .pie
               
               var style = {};
               
               CSSService.addRotationToStyleObject(style,
                     $scope.getCircleDegrees());
                 
               //style['border-color'] = $scope.color;
               style['background-color'] = $scope.color;
               
               return style;
            }
            
            $scope.getCirclePieStyle = function() {
               // .timer > .slice > .pie
               
               var style = {};
               
               CSSService.addRotationToStyleObject(style,
                     $scope.getCircleDegrees());
                 
               style['border-color'] = $scope.color;
               
               return style;               
            }
            
            $scope.getCirclePieFillStyle = function() {
               // .pie.fill
               
               var percent = $scope.getLoadingPercentageAsInt();
               
               var style = {};
               
               if (percent > 50) {
                  style['display'] = 'block';
                  
                  CSSService.addRotationToStyleObject(style,
                           $scope.getCircleDegrees()); 
               } else {
                  style['display'] = 'none';
               }
               
               return style;
            }
            
            var $div = $element.children("div");
            
            $div.css('display', 'inline-block');
            $div.addClass('loading-progress');
                        
            if ('spinner' === $scope.type) {
               var $imageElement = angular.element("<img />");
               $imageElement.attr('src', './images/spinner.gif');
               $imageElement.attr('ng-style', 'getSpinnerStyle()');

               $div.append($compile($imageElement)($scope));
            } else if ('circle' === $scope.type ||
                       'pie' === $scope.type) {
               var $loadingElement = angular.element("<div></div>");
               
               $loadingElement.addClass('timer');
               
               if ('pie' === $scope.type) {
                  $loadingElement.addClass('fill');
               }
               
               if ('circle' === $scope.type) {
                  var $percentDiv = angular.element("<div></div>");
                  $percentDiv.addClass('percent');
                  
                  $loadingElement.append(percentDiv);
               }
               
               /*
                  <div class="percent">
                  </div>
                  <div class="slice"'+(percent > 50?' class="gt50"':'')+'>
                     <div class="pie"></div>
                     (percent > 50 ? <div class="pie fill"></div>)
                  </div>               
               */
               
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