'use strict';

var registerService = require('services/register');

var name = 'services.youtube_url_modal';

registerService('factory', name, [require('services/modal'),
                                  require('services/scope_service'),
                                  require('services/promise'),
function(ModalService, ScopeService, Promise) {
   function YoutubeUrlModalService() {
      return Promise(function(resolve, reject, notify) {
         var $scope = ScopeService.newRootScope();
         
         $scope.url = {url: ""};
         $scope.onCancelClicked = function() {
            resolve("");
            this.$hide();
         }         
         
         $scope.onOkClicked = function() {
            console.log($scope);
            resolve($scope.url.url);
            this.$hide();
         }
         
         ModalService($scope, "modals/full/youtube_url_modal_full.html",
         null, {
            keyboard: false,
            backdrop: 'static',
            title: "Enter Youtube URL"
         });
      });
   }
   
   return YoutubeUrlModalService;
}]);

module.exports = name;