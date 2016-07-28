'use strict';

var Moment = require('moment-timezone');

module.exports = {};
module.exports.dateToObject = dateToObject;
module.exports.newISODateString = newISODateString;
module.exports.dateIsBefore = dateIsBefore;

function dateToObject(date) {
   return new Moment(date);
}

function newISODateString(string) {
   var date;
   if (string) {
      date = new Date(string);
   } else {
      date = new Date();
   }
   return date.toISOString();
}

function dateIsBefore(date, otherDate) {
   var dateObject = dateToObject(date);
   var otherDateObject = dateToObject(otherDate);

   return dateObject.isBefore(otherDate);
}
