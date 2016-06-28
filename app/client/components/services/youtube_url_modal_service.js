'use strict';

var registerService = require('services/register');

var name = 'services.youtube_url_modal';

registerService('factory', name, [require('services/modal'),
                                  require('services/scope_service'),
                                  require('services/promise'),
function(ModalService, ScopeService, Promise) {
   function YoutubeUrlModalService(url) {
      return Promise(function(resolve, reject, notify) {
         var $scope = ScopeService.newRootScope();
         
         $scope.url = {url: (url || "")};
         $scope.onCancelClicked = function() {
            resolve(null);
            this.$hide();
         }         
         
         $scope.onOkClicked = function() {
            resolve($scope.url);
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