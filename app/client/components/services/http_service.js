'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.http_service';

registerService('factory', name, ['$http',
                                  require('services/promise'),
                                  require('models/http_response'),
                                  require('services/error'),
function($http, PromiseService, HttpResponseModel, ErrorService) {
    function httpService() {
        
    }
    
    httpService.execute = function(config) {
        return PromiseService(function(resolve, reject, notify) {
            $http(config)
            .then(function(response) {
                resolve(HttpResponseModel.initFromHttpResponse(response));
            }, null,
            function(progressData) {
                
            })
            .catch(function(response) {
                var httpResponse = HttpResponseModel.initFromHttpResponse(response);

                var data = httpResponse.data;
                var text = "";
                
                if (true === utils.isPlainObject(data)) {
                    if (false === utils.isUndefinedOrNull(data.error)) {
                        text = data.error;
                    }
                } else if ('string' === typeof data) {
                    text = data;
                } else {
                    if (-1 === httpResponse.status) {
                        text = "Cannot connect to server";
                    } else {
                        text = "Unknown error";
                    }
                }
                
                ErrorService.rejectDeferred(text, httpResponse.status, reject);    
            })
        })
    }
    
    httpService.get = function(url, params, data) {
        return this.execute({
            url: url,
            params: params,
            data: data,
            method: 'GET'
        });
    }
    
    httpService.post = function(url, params, data) {
        return this.execute({
            url: url,
            params: params,
            data: data,
            method: 'POST'
        });        
    }
    
    httpService.put = function(url, params, data) {
        return this.execute({
            url: url,
            params: params,
            data: data,
            method: 'PUT'
        });        
    }
    
    httpService.patch = function(url, params, data) {
        return this.execute({
           url: url,
           params: params,
           data: data,
           method: 'PATCH' 
        });
    }
    
    httpService.delete = function(url, params, data) {
        return this.execute({
            url: url,
            params: params,
            data: data,
            method: 'DELETE'
        });        
    }
    
    return httpService;
}]);

module.exports = name;