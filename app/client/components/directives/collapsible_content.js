'use strict';

var registerDirective = require('directives/register');

var name = 'collapsibleContent';

registerDirective(name, [require('services/scope_service'),
function(ScopeService) {
   return {
      restrict: "E",
      scope: {
         title: "@"
         //allowsSearch: "@"
      },
      templateUrl: "directives/collapsible_content.html",
      transclude: true,
      replace: true,
      link: function($scope, $element, $attributes, $controller, $transclude) {
         $element.addClass('collapsible-content');
         
         $scope.isOpen = false;

         ScopeService.watchBool($scope, $attributes, 'allowsSearch', false);

         function GetContentDiv() {
            var $contentDiv = null;

            [].every.call($element.children(), function(node) {
               var $node = angular.element(node);
               if (true === $node.hasClass('content')) {
                  $contentDiv = $node;
                  return false;
               } else {
                  return true;
               }
            });

            return $contentDiv;
         }

         function GetCollapseContentDiv() {
            var $contentDiv = GetContentDiv();

            var $collapseContentDiv = null;

            [].every.call($contentDiv.children(), function(node) {
               var $node = angular.element(node);

               if (true === $node.hasClass('collapse-content')) {
                  $collapseContentDiv = $node;
                  return false;
               } else {
                  return true;
               }
            });

            return $collapseContentDiv;
         }

         function Expand() {
            var $contentDiv = GetContentDiv();
            $contentDiv[0].style.height = $contentDiv[0].scrollHeight + "px";
         }

         function Collapse() {
            var $contentDiv = GetContentDiv();
            $contentDiv[0].style.height = "0px";
         }

         $scope.toggleOpen = function() {
            if ($scope.isOpen) {
               Collapse();
            } else {
               Expand();
            }
            $scope.isOpen = !$scope.isOpen;
         }

         $transclude($scope.$parent, function(clone, scope) {
            GetCollapseContentDiv().append(clone);
            Collapse();
         })
      }
   }
}
]);

module.exports = name;