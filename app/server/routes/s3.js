'use strict';

var express = require('express');
var router = express.Router();

var s3 = require(__base + 'lib/s3');
var StaticUpload = require(__base + 'lib/static_upload');

var Responder = require(__base + 'lib/responder');

router.route('/signed_url')
.get(function(request, result) {
   var uploadType = request.query.upload_type; 
   /*
      profile_picture, 
      question_video, 
      question_picture, 
      comment_video, 
      comment_picture
   */
   var uploadFileType = request.query.file_type;
   
   var key = StaticUpload.getStaticUploadKey(uploadType);
   
   if (!key) {
      Responder.badRequest(result, "Invalid upload type!");
   } else {   
      s3.signPutRequest(key, 
         uploadFileType, 'public-read')
      .then(function(data) {
         Responder.ok(result, data);
      })
      .catch(function(error) {
         Responder.badRequest(result, error);
      });
   }
})
.post(function(request, result) {
   Responder.methodNotAllowed(result);
})
.put(function(request, result) {
   Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
   Responder.methodNotAllowed(result);
})

module.exports = router;