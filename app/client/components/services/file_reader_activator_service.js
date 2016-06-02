'use strict';

var registerService = require('services/register');

var name = 'services.file_reader_activator';

// OK!  Why is this service here?

// To put it in brief: the web browser on Android Phones,
// and probably some other browsers, have decided that it's
// in their best interest to only allow programatically "clicking"
// input type="file" elements within an event that was originated by
// user action, so in other words, a click on a button or something.

// This makes a little bit of sense, as a spam page could easily get a file
// upload from a user by mistake by popping up a file selector.

// HOWEVER, WHAT THEY FAIL TO REALIZE IS THAT THIS IS THE 21ST CENTURY,
// AND WEB FRAMEWORKS HAVE EVOLVED BEYOND JQUERY.

// My original approach was to have angular set a scope variable on the directive
// which told the directive to activate itself, which it then would do with
// a manual click event.  This worked fine, as this was only done in response to the
// user clicking some sort of button or link.

// HOWEVER, even though I set this variable within a user-started event, the actual
// callback happens OUTSIDE of this event handler, when the event has been handled, so
// when I try to activate the file picker there, it won't work!!!!!!!!

// This is utterly ridiculous, so I had to make a workaround in the file reader,
// enough that I had to make this entire service just to keep track of the variables
// and hacked methodology.

// Every time a file reader is on a page, the controller or parent directive
// has to set a scope variable to tell it to create an input element, which gives itself
// its own unique ID, which is also returned to the caller in a callback function.

// Then, when it's time to activate, we have to basically use document.getElementById
// and the click() function, as the dispatchEvent function DOES NOT WORK EITHER.

// Surely there is a better solution than this hacked up nonsense.  There've been no complaints
// on mobile Safari...

// PLUS: DESKTOP CHROME DOES NOT HAVE THIS CONSTRAINT!  ONLY ANDROID MOBILE!!!  WHAT A JOKE!!

// </rant>

registerService('factory', name, [
function() {
   function FileReaderActivatorService() {
      
   }
   
   FileReaderActivatorService.makeCreationObject = function() {
      return {
         create: false,
         id: ""
      };
   }
   
   FileReaderActivatorService.createFileReader = function(creationObject) {
      creationObject.create = true;
   }
   
   FileReaderActivatorService.fileReaderCreated = function(creationObject, id) {
      creationObject.id = id;
   }
   
   FileReaderActivatorService.activateFileReader = function(creationObject) {
      var element = document.getElementById(creationObject.id);
      
      if (!element) {
         throw new Error("activateFileReaderWithId: No element with id: " + creationObject.id);
      } else {     
         element.click();
      }
   }
   
   return FileReaderActivatorService;
}   
]);

module.exports = name;