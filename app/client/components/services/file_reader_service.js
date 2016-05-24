'use strict';

var registerService = require('services/register');

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
 require('services/data_url_service'),
function(Promise, SerialPromise, 
ParallelPromise, ProgressService, ErrorService,
DataUrlService) {
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
   
   FileReaderService.readAsArrayBuffer = function(file) {
      return Promise(function(resolve, reject, notify) {
         var fileReader = FileReaderService.initFileReader(resolve, reject, notify);
         
         fileReader.readAsArrayBuffer(file);
      });
   }
   
   FileReaderService.readAsDataUrl = function(file) {
      return Promise(function(resolve, reject, notify) {
         var fileReader = FileReaderService.initFileReader(resolve, reject, notify);
         
         fileReader.readAsDataURL(file);
      });      
   }
   
   FileReaderService.readAsDataUrlPromiseHelper = function(file) {
      return Promise(function(resolve, reject, notify) {
         FileReaderService.readAsDataUrl(file)
         .then(function(result) {
            resolve({dataUrl: result});
         }, null, function(progress) {
            notify(progress);
         })   
         .catch(function(error) {
            reject(error);
         });
      });
   }
   
   FileReaderService.readAsArrayBufferPromiseHelper = function(file) {
      return Promise(function(resolve, reject, notify) {
         FileReaderService.readAsArrayBuffer(file)
         .then(function(result) {
            resolve({arrayBuffer: result});
         }, null, function(progress) {
            notify(progress);
         })   
         .catch(function(error) {
            reject(error);
         });
      });         
   }
   
   return FileReaderService;
}
]);

module.exports = name;