'use strict'

var registerModel = require('./register');
var classy = require('classy');

var name = 'models.time';

var utils = require('utils');

registerModel(name, [require('models/base'),
function(BaseModel) {
   return classy.define({
      extend: BaseModel,
      alias: name,

      statics: {
         fields: function() {
            return this.staticMerge(this.callSuper(), {
               hour: 0,
               minute: 0,
               second: 0,
               sub_second: 0
            })
         }
      },

      init: function(config, isFromServer) {
         this.callSuper();
      },

      fromSeconds: function(seconds) {
         this.hour = utils.round(seconds / 3600);
         seconds = seconds % 3600;

         this.minute = utils.round(seconds / 60);
         seconds = seconds % 60;

         this.second = seconds;

         this.sub_second = 0;
      },

      toString: function(canHideZeroValues) {
         canHideZeroValues = utils.checkBoolean(canHideZeroValues, true);

         if (false === canHideZeroValues) {
            return "" + this.hour + ":" 
                  + this.minute + ":"
                  + this.second + "."
                  + this.sub_second;
         } else {
            var returnString = "";

            if (this.hour) {
               returnString += "" + this.hour;
            }
            if (this.minute) {
               if (returnString) {
                  returnString += ":";
               }
               returnString += "" + this.minute;
            }
            if (this.second) {
               returnString += 
               ":" + utils.padWithLeadingZeroes(this.second, 2);
            } else {
               returnString += ":00";
            }
            if (this.sub_second) {
               returnString += "." + this.sub_second;
            }

            return returnString;
         }
      },

      fromString: function(string) {
         this.fromSeconds(utils.parseTimeStringToSeconds(string));
      }
   });
}]);

module.exports = name;