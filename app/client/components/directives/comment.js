'use strict';

var registerDirective = require('directives/register');

var name = 'comment';

registerDirective(name, [require('services/scope_service'),
                         require('models/comment'),
                         require('services/promise'),
function(ScopeService, CommentModel, Promise) {
   return {
      restrict: "E",
      scope: {
         model: "=",

         onSaveClicked: "&",
         onCancelClicked: "&",

         saveButtonText: "@",
         cancelButtonText: "@"
      },
      templateUrl: "directives/comment.html",
      link: function($scope, $element, $attributes) {
         $element.addClass("comment");

         $scope.hasCheckedInitiallyEditing = false;
         $scope.isEditing = false;

         ScopeService.watchBool($scope, $attributes,
            'isEditable', true);
         ScopeService.watchBool($scope, $attributes,
            'isInitiallyEditing', false, function(newValue) {
            if (!$scope.hasCheckedInitiallyEditing) {
               $scope.hasCheckedInitiallyEditing = true;
               if (true === $scope.isInitiallyEditing) {
                  $scope.editClicked();
               }
            }
         });

         $scope.setIsEditing = function(isEditing) {
            $scope.isEditing = isEditing;
            if (isEditing) {
               if (!$scope.editingComment) {
                  $scope.editingComment = new CommentModel();
               }
               $scope.editingComment.fromModel($scope.model);
            }
            $scope.model.setInternalVariable('is_editing', isEditing);
         }

         $scope.editClicked = function() {
            $scope.setIsEditing(true);
         }

         $scope.saveClicked = function() {
            $scope.saveComment();
         }

         $scope.cancelClicked = function() {
            $scope.setIsEditing(false);
            $scope.onCancelClicked({comment: $scope.model});
         }

         $scope.saveComment = function() {
            return Promise(function(resolve, reject) {
               var previousModel = $scope.model.clone();

               $scope.model.fromModel($scope.editingComment);

               Promise.when($scope.onSaveClicked({comment: $scope.model}))
               .then(function() {
                  $scope.setIsEditing(false);
                  resolve();
               })
               .catch(function(error) {
                  $scope.model.fromModel(previousModel);
                  reject(error);
               })
            });
         }
      }
   }
}]);

module.exports = name;