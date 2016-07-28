'use strict';

var registerModel = require('models/register');
var classy = require('classy');

var name = 'models.http_response';

registerModel(name, [require('./base'),
function(BaseModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

/*
data – {string|Object} – The response body transformed with the transform functions.
status – {number} – HTTP status code of the response.
headers – {function([headerName])} – Header getter function.
config – {Object} – The configuration object that was used to generate the request.
statusText – {string} – HTTP status text of the response.
*/

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
                data: null,
                status: -1,
                config: {
                    
                },
                headerFn: function() {
                    throw new Error("headerFn: Unimplemented!");
                },
                statusText: ""
            })
         },
         
         initFromHttpResponse: function(response) {
             return new this({
                 data: response.data,
                 status: response.status,
                 headerFn: response.headers,
                 config: response.config,
                 statusText: response.statusText
             });
         }
      },

      init: function(config, isFromServer) {
         this.callSuper()
      },

      isNoContent: function() {
         return 204 === this.status;
      },

      isOk: function() {
         return 200 === this.status;
      }
   })    
}]);

module.exports = name;