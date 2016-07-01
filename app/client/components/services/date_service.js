'use strict';

var registerService = require('services/register');

var name = 'services.date';

var Moment = require('moment-timezone');

registerService('factory', name, [
function() {
   function DateService() {

   }

   DateService.fromString = function(dateString) {
      return new Moment(dateString);
   }

   DateService.toFormattedString = function(date, formatString) {
      if (!date.isValid()) {
         return "";
      } else {
         return date.format(formatString);
      }
   }

   DateService.toDefaultFormattedString = function(date) {
      return DateService.toFormattedString(date, "MMMM Do YYYY");
   }

   DateService.dateStringToFormattedString = function(dateString) {
      return DateService.toDefaultFormattedString(DateService.fromString(dateString));
   }

   return DateService;
}
]);

module.exports = name;