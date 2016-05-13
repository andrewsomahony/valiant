'use strict';

var registerService = require('services/register');

var ExifReader = require('exif').ExifImage;
var PiExifReader = require('piexifjs');
var exifOrient = require('exif-orient');

var name = 'services.file_reader_service';

// This service does NOT use FileModel,
// it's entirely to be used as a wrapper
// for the HTML File object

registerService('factory', name, 
[require('services/promise'),
 require('services/serial_promise'),
 require('services/parallel_promise'),
 require('services/progress'),
 require('services/error'),
function(Promise, ProgressService, ErrorService) {
   function FileReaderService() {
      
   }
   
   FileReaderService.initFileReader = function(resolve, reject, notify) {
      var fileReader = new FileReader();
      
      fileReader.onload = function(e) {
         resolve(e.target.result);
      }
      
      fileReader.onerror = function(e) {
         e = e || window.event; // Sometimes the e argument is missing? 

         var errorText = "";
         switch(e.target.error.code) {
            case e.target.error.NOT_FOUND_ERR:
               errorText = "File not found!";
               break;

            case e.target.error.NOT_READABLE_ERR:
               errorText = "File not readable!";
               break;

            case e.target.error.ABORT_ERR:
               errorText = "Read operation aborted!";
               break;

            case e.target.error.SECURITY_ERR:
               errorText = "File is locked!";
               break;

            case e.target.error.ENCODING_ERR:
               errorText = "File too big!";
               break;

            default:
               status.innerHTML = 'Read error.';
               break;

         }  

         reject(ErrorService.localError(errorText));
      }
      
      fileReader.onprogress = function(e) {
         notify(ProgressService(e.loaded, e.total, "Loading file..."));
      }
      
      return fileReader;
   }
   
   FileReaderService.readAsArrayBuffer = function(file, processExif) {
      return Promise(function(resolve, reject, notify) {
         var fileReader = FileReaderService.initFileReader(resolve, reject, notify);
         
         fileReader.readAsArrayBuffer(file);
      });
   }
   
   FileReaderService.readAsDataUrl = function(file, processExif) {
      return Promise(function(resolve, reject, notify) {
         var fileReader = FileReaderService.initFileReader(resolve, reject, notify);
         
         fileReader.readAsDataUrl(file);
      });      
   }
   
   FileReaderService.processExifData = function(file) {
      var promiseFnArray = [];
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);   
         } else {
            return Promise(function(resolve, reject, notify) {
               FileReaderService.readAsDataUrl(file)
               .then(function(dataUrl) {
                  resolve({dataUrl: dataUrl});
               }) 
               .catch(function(e) {
                  reject(e);
               });         
            });
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               /*new ExifReader({image: existingData.arrayBuffer},
               function(error, exifData) {
                  if (error) {
                     reject(error);
                  } else {
                     resolve({exifData: exifData});
                  }
               });*/
               try {
                  resolve({exifData: PiExifReader.load(existingData.dataUrl)});
               } catch (e) {
                  // The error messages in this library
                  // have awful grammar...
                  reject(ErrorService.localError("Error reading EXIF data"));
               }
            });
         }
      });
      
      promiseFnArray.push(function(existingData, index, forNotify) {
         if (true === forNotify) {
            return ProgressService(0, 1);
         } else {
            return Promise(function(resolve, reject, notify) {
               console.log("EXIF DATA", existingData.exifData);
               resolve({});
               //exifOrient(existingData.dataUrl)
            });
         }
      });
      
      return SerialPromise.withNotify(promiseFnArray);
   }
   
   return FileReaderService;
}
]);

module.exports = name;