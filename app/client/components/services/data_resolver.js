'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.data_resolver';

registerService('factory', name, [
    require('services/parallel_promise'),
    require('services/serial_promise'),
    require('services/user_service'),
    require('services/facebook_service'),
    require('services/progress'),
    
    function(ParallelPromise, SerialPromise, UserService, FacebookService, ProgressService) {
        function DataResolverService(state, params) {
            var promiseFnArray = [];

            function AddServiceResolverFunction(serviceObject) {
                var dataResolverFunctionName = "dataResolverFn";
                if (true === utils.objectHasFunction(serviceObject, dataResolverFunctionName)) {
                    promiseFnArray.push(serviceObject[dataResolverFunctionName]);
                }
            }
            
            AddServiceResolverFunction(UserService);
            AddServiceResolverFunction(FacebookService);
            
            return ParallelPromise(promiseFnArray.map(function(fn, index) {
                return function(existingData, index, forNotify) {
                    if (true === forNotify) {
                        return ProgressService(0, 1);
                    } else {
                        return fn(state, params);
                    }
                }
            }));
        }
        
        return DataResolverService;
    }
]);

module.exports = name;