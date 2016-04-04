var registerService = require('services/register');
var utils = require('utils');

var name = 'modalService';

registerService('factory', 
                name, 
                ['$modal', 
                 '$templateCache',
function($modal, $templateCache) {
   function modalService($scope, fullTemplateUrl, templateUrl, options) {
      fullTemplateUrl = fullTemplateUrl || 'modal/modal.tpl.html'

      var templateContent = $templateCache.get(templateUrl);

      var modalOptions = {
         container: '.modal-container',
         placement: 'center',
         contentTemplate: templateUrl,
         animation: 'am-fade-and-scale',
         scope: $scope,
         templateUrl: fullTemplateUrl // The footer button disappears without this property
      }

      modalOptions = utils.extend(true, modalOptions, options)
      return $modal(modalOptions)
   }

   return modalService;
}])

module.exports = name