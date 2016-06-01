'use strict';

var registerFilter = require('filters/register');

var name = 'trusted';

registerFilter(name, ['$sce',
function($sce) {
   return function(url) {
      return $sce.trustAsResourceUrl(url);
   }
}]);

module.exports = name;