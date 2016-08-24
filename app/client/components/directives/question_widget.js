'use strict';

var registerDirective = require('directives/register');

var name = 'questionWidget';

registerDirective(name, [require('services/scope_service'),
                         require('services/date_service'),
                         require('services/state_service'),
function(ScopeService, DateService, StateService) {
   return {
      restrict: "E",
      scope: {
         question: "<model",
         size: "@",
         //isLink: "@"
      },
      templateUrl: "directives/question_widget.html",
      link: function($scope, $element, $attributes) {
         ScopeService.watchBool($scope, $attributes, 'isLink', false);

         $scope.getWidgetStyle = function() {
            var style = {};

            style['width'] = $scope.size;
            style['height'] = $scope.size;
            style['font-size'] = (parseInt($scope.size) * 0.07) + "px";

            return style;
         }

         $scope.getWidgetClass = function() {
            var classes = [];

            classes.push('question-widget');
            if (true === $scope.isLink) {
               classes.push('link');
            }

            return classes;
         }

         $scope.getQuestionDate = function() {
            return DateService.dateStringToDefaultFormattedString(
               $scope.question.created_at);
         }

         $scope.onWidgetClicked = function() {
            if (true === $scope.isLink) {
               StateService.go(
                  'main.question', {questionId: $scope.question.id});
            }
         }
      }
   }
}])

module.exports = name;
