'use strict';

var registerDirective = require('directives/register');

var utils = require('utils');

var name = 'loadingProgress';

registerDirective(name, ['$compile',
                         require('services/css_service'),
   function($compile, CSSService) {
      return {
         restrict: 'A',
         scope: {
            //type: "@", (spinner, circle, pie, image, bar, overlay)
            progressObject: "<",
            //width: "@",
            //height: "@",
            //imageUrl: "@",
            //color: "@",
            //showPercentage: "@"
         },
         link: function($scope, $element, $attributes) {
           
            $scope.type = $attributes.type || "spinner";
            $scope.imageUrl = $attributes.imageUrl || null;
            
            $scope.width = $attributes.width || null;
            $scope.height = $attributes.height || null;
            
            $scope.color = $attributes.color || "blue";
            
            $scope.showPercentage = $attributes.showPercentage ? ('true' === $attributes.showPercentage ? true : false)
                                     : true;
            
            $scope.getLoadingBarParentStyle = function() {
               return {
                  'border-color': $scope.color,
                  'width': $scope.width,
                  'height': $scope.height
               }
            }
            
            // Returns number from 0-100
            $scope.getLoadingPercentageAsInt = function() {
               if (!$scope.progressObject) {
                  return 0;
               } else {
                  return utils.round($scope.progressObject.percentage() * 100, 0);
               }
            }
            
            $scope.getCircleDegrees = function() {
               return utils.round(360 * ($scope.getLoadingPercentageAsInt() / 100), 0);
            }
            
            $scope.getOverlayWidth = function() {
               return "" + (100 - $scope.getLoadingPercentageAsInt()) + "%";
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
            
            //circle/pie style/class methods
            // What on earth do I name these things
            // to distinguish?!  The root style names
            // are a bit odd.
            
            $scope.getCircleRootStyle = function() {
               var style = {};
               
               // !!! This has to be an even number,
               // !!! or else we get a white line
               // !!! in the middle of the spinner.
               
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
                  return "gt50";
               } else {
                  return "";
               }
            }
            
            $scope.getFilledCirclePieStyle = function() {
               // .timer.fill > .slice > .pie
               
               var style = {};
               
               CSSService.addRotationToStyleObject(style,
                     $scope.getCircleDegrees());
                 
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
            
            $scope.getPieFillStyle = function() {
               // .timer.fill > .pie.fill
               
               var percent = $scope.getLoadingPercentageAsInt();
               
               var style = {};
               
               if (percent > 50) {
                  style['display'] = 'block';
                  
                  style['background-color'] = $scope.color;
                  CSSService.addRotationToStyleObject(style,
                           $scope.getCircleDegrees()); 
               } else {
                  style['display'] = 'none';
               }
               
               return style;
            }

            $scope.getCircleFillStyle = function() {
               // .timer > .pie.fill
               
               var percent = $scope.getLoadingPercentageAsInt();
               
               var style = {};
               
               if (percent > 50) {
                  style['display'] = 'block';
                  
                  style['border-color'] = $scope.color;
               } else {
                  style['display'] = 'none';
               }
               
               return style;
            }
            
            var $div = $element;
            $div.addClass('loading-progress');
                        
            if ('spinner' === $scope.type) {
               var $imageElement = angular.element("<img />");
               $imageElement.attr('src', './images/spinner.gif');
               $imageElement.attr('ng-style', 'getSpinnerStyle()');

               $div.append($compile($imageElement)($scope));
            } else if ('circle' === $scope.type ||
                       'pie' === $scope.type) {
               if (!$scope.width) {
                  if ($scope.height) {
                     $scope.width = $scope.height;
                  } else {
                     $scope.width = "50px";
                  }
               }              
                             
               var $loadingElement = angular.element("<div></div>");
               
               $div.css('width', $scope.width);
               $div.css('height', $scope.width);
               
               $loadingElement.addClass('timer');
               $loadingElement.attr('ng-style', 'getCircleRootStyle()');
               
               if ('pie' === $scope.type) {
                  $loadingElement.addClass('fill');
               }
               
               if ('circle' === $scope.type &&
                   true === $scope.showPercentage) {
                  var $percentDiv = angular.element("<div></div>");
                  $percentDiv.addClass('percent');
                  
                  $loadingElement.append(percentDiv);
               }
               
               var $sliceDiv = angular.element("<div></div>");
               $sliceDiv.addClass('slice');
               $sliceDiv.attr('ng-class', 'getCircleSliceClass()');
               
               var $pieDiv = angular.element("<div></div>");
               $pieDiv.addClass('pie');
               
               if ('pie' === $scope.type) {
                  $pieDiv.attr('ng-style', 'getFilledCirclePieStyle()');
               } else {
                  $pieDiv.attr('ng-style', 'getCirclePieStyle()');
               }
               
               $sliceDiv.append($pieDiv);
               
               var $pieFillDiv = angular.element("<div></div>");
               $pieFillDiv.addClass('pie');
               $pieFillDiv.addClass('fill');
               
               if ('pie' === $scope.type) {
                  $pieFillDiv.attr('ng-style', 'getPieFillStyle()');
               } else {
                  $pieFillDiv.attr('ng-style', 'getCircleFillStyle()');
               }
               
               $sliceDiv.append($pieFillDiv);
               
               $loadingElement.append($sliceDiv);
               
               $div.append($compile($loadingElement)($scope));               
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
            } else if ('overlay' === $scope.type) {
               $div.css('position', 'absolute'); 
               $div.css('width', '100%');
               $div.css('height', '100%');
               $div.css('left', '0px');
               $div.css('top', '0px');  
                  
               var $overlayElement = angular.element("<div></div>");
               $overlayElement.attr('overlay', '');
               $overlayElement.attr('width', 'getOverlayWidth()');
               $overlayElement.css('right', '0px');
               
               $div.append($compile($overlayElement)($scope));
            }
         }
      };
   }
])

module.exports = name;