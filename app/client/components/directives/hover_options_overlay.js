'use strict';

var registerDirective = require('directives/register');

var name = 'hoverOptionsOverlay';

registerDirective(name, [require('services/scope_service'),
                         '$compile',
                         '$parse',
                         '$timeout',
function(ScopeService, $compile, $parse, $timeout) {
   return {
      restrict: "E",
      scope: {
         //canDelete: "@",
         //canView: "@",
         onDelete: "&",
         onView: "&",

         buttonSize: "@"
      },
      templateUrl: "directives/hover_options_overlay.html",
      link: function($scope, $element, $attributes) {
         ScopeService.watchBool($scope, $attributes, 'canDelete', true);
         ScopeService.watchBool($scope, $attributes, 'canView', true);

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

            $scope.onDelete();
         }

         $scope.onViewClicked = function(e) {
            e.preventDefault();
            e.stopPropagation();

            $scope.onView();
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
      }
   }
}
])

module.exports = name;