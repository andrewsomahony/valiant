'use strict';

var registerDirective = require('directives/register');

var name = 'hoverOptionsOverlay';

registerDirective(name, [require('services/scope_service'),
                         '$compile',
                         '$parse',
function(ScopeService, $compile, $parse) {
   return {
      restrict: "A",
      /*scope: {
         //canDelete: "@",
         //canView: "@",
         onDelete: "&",
         onView: "&",

         buttonSize: "@"
      },*/
      link: function($scope, $element, $attributes) {
         $scope.canDelete = ScopeService.parseBool($attributes.canDelete, true);
         $scope.canView = ScopeService.parseBool($attributes.canView, true);

         var onDelete = $parse($attributes['onDelete']);
         var onView = $parse($attributes['onView']);

         $scope.canShowButtons = false;

         $scope.getOverlayElementStyle = function() {
            var style = {};

            style['top'] = "0px";
            style['left'] = "0px";
            style['right'] = "0px";
            style['bottom'] = "0px";

            return style;
         }

         $scope.onDeleteClicked = function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (onDelete) {
               onDelete($scope);
            }
         }

         $scope.onViewClicked = function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (onView) {
               onView($scope);
            }
         }

         $scope.getGenericButtonStyle = function() {
            var style = {};

            if ($scope.canShowButtons) {
               style['display'] = 'inline-block';
            } else {
               style['display'] = 'none';
            }

            style['width'] = $attributes.buttonSize;
            style['height'] = $attributes.buttonSize;

            return style;
         }

         $scope.getDeleteButtonStyle = function() {
            var style = $scope.getGenericButtonStyle();

            var sizeOffset = parseInt($attributes.buttonSize) / 4;

            style['top'] = -sizeOffset + "px";
            style['left'] = -sizeOffset + "px";

            return style;
         }

         $scope.getViewButtonStyle = function() {
            var style = $scope.getGenericButtonStyle();

            var sizeOffset = parseInt($attributes.buttonSize) / 4;
            var visualOffset = parseInt($attributes.buttonSize) / 8;

            style['top'] = -sizeOffset + "px";
            style['right'] = (-sizeOffset - visualOffset) + "px";

            return style;
         }

         $scope.onOverlayMouseOver = function() {
            $scope.canShowButtons = true;
         }

         $scope.onOverlayMouseOut = function() {
            $scope.canShowButtons = false;
         }

         var $overlayElement = angular.element("<div></div>");
         $overlayElement.addClass('hover-options-overlay');

         $overlayElement.attr('ng-style', 'getOverlayElementStyle()');
         $overlayElement.attr('ng-mouseover', 'onOverlayMouseOver()');
         $overlayElement.attr('ng-mouseout', 'onOverlayMouseOut()');

         if (true === $scope.canDelete) {
            var $deleteButton = angular.element("<div></div>");
            $deleteButton.addClass('options-button');

            $deleteButton.attr('ng-click', 'onDeleteClicked($event)');
            $deleteButton.attr('ng-style', 'getDeleteButtonStyle()');

            var $deleteImage = angular.element("<img />");
            $deleteImage.attr('ng-src', 'images/close.png');

            $deleteButton.append($deleteImage);
            $overlayElement.append($deleteButton);
         }

         if (true === $scope.canView) {
            var $viewButton = angular.element("<div></div>");
            $viewButton.addClass('options-button');

            $viewButton.attr('ng-click', 'onViewClicked($event)');
            $viewButton.attr('ng-style', 'getViewButtonStyle()');

            var $viewImage = angular.element("<img />");
            $viewImage.attr('ng-src', 'images/eye.png');

            $viewButton.append($viewImage);
            $overlayElement.append($viewButton);
         }

         $element.append($compile($overlayElement)($scope));
      }
   }
}
])

module.exports = name;