'use strict';

var registerController = require('controllers/register');

var name = 'controllers.main.set_builder.default';

registerController(name, ['$scope',
require('models/set_builder/set'),
function($scope, SetModel) {
   $scope.tempSet = new SetModel();
   $scope.tempSet.setInternalVariable('is_unborn', true);
}])

module.exports = name;