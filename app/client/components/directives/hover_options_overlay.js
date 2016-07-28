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
         var $newScope = ScopeService.newScope($scope);

         $newScope.canDelete = ScopeService.parseBool($attributes.canDelete, true);
         $newScope.canView = ScopeService.parseBool($attributes.canView, true);

         $newScope.onDelete = $parse($attributes.onDelete);
         $newScope.onView = $parse($attributes.onView);

         $newScope.canShowButtons = false;

         $newScope.getOverlayElementStyle = function() {
            var style = {};

            style['top'] = "0px";
            style['left'] = "0px";
            style['right'] = "0px";
            style['bottom'] = "0px";

            return style;
         }

         $newScope.onDeleteClicked = function(e) {
            e.preventDefault();
            e.stopPropagation();

            $newScope.onDelete($scope);
         }

         $newScope.onViewClicked = function(e) {
            e.preventDefault();
            e.stopPropagation();

            $newScope.onView($scope);
         }

         $newScope.getGenericButtonStyle = function() {
            var style = {};

            if ($newScope.canShowButtons) {
               style['display'] = 'inline-block';
            } else {
               style['display'] = 'none';
            }

            style['width'] = $attributes.buttonSize;
            style['height'] = $attributes.buttonSize;

            return style;
         }

         $newScope.getDeleteButtonStyle = function() {
            var style = $newScope.getGenericButtonStyle();

            var sizeOffset = parseInt($attributes.buttonSize) / 4;

            style['top'] = -sizeOffset + "px";
            style['left'] = -sizeOffset + "px";

            return style;
         }

         $newScope.getViewButtonStyle = function() {
            var style = $newScope.getGenericButtonStyle();

            var sizeOffset = parseInt($attributes.buttonSize) / 4;
            var visualOffset = parseInt($attributes.buttonSize) / 8;

            style['top'] = -sizeOffset + "px";
            style['right'] = (-sizeOffset - visualOffset) + "px";

            return style;
         }

         $newScope.onOverlayMouseOver = function() {
            $newScope.canShowButtons = true;
         }

         $newScope.onOverlayMouseOut = function() {
            $newScope.canShowButtons = false;
         }

         var $overlayElement = angular.element("<div></div>");
         $overlayElement.addClass('hover-options-overlay');

         $overlayElement.attr('ng-style', 'getOverlayElementStyle()');
         $overlayElement.attr('ng-mouseover', 'onOverlayMouseOver()');
         $overlayElement.attr('ng-mouseout', 'onOverlayMouseOut()');

         if (true === $newScope.canDelete) {
            var $deleteButton = angular.element("<div></div>");
            $deleteButton.addClass('options-button');

            $deleteButton.attr('ng-click', 'onDeleteClicked($event)');
            $deleteButton.attr('ng-style', 'getDeleteButtonStyle()');

            var $deleteImage = angular.element("<img />");
            $deleteImage.attr('ng-src', 'images/close.png');

            $deleteButton.append($deleteImage);
            $overlayElement.append($deleteButton);
         }

         if (true === $newScope.canView) {
            var $viewButton = angular.element("<div></div>");
            $viewButton.addClass('options-button');

            $viewButton.attr('ng-click', 'onViewClicked($event)');
            $viewButton.attr('ng-style', 'getViewButtonStyle()');

            var $viewImage = angular.element("<img />");
            $viewImage.attr('ng-src', 'images/eye.png');

            $viewButton.append($viewImage);
            $overlayElement.append($viewButton);
         }

         $element.append($compile($overlayElement)($newScope));
      }
   }
}
])

module.exports = name;