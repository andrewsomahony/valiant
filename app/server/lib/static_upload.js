'use strict';

var uuid = require('node-uuid');

module.exports = StaticUpload;
module.exports.getStaticUploadKey = getStaticUploadKey;

function StaticUpload() {
   
}

function getStaticUploadFilename() {
   return uuid.v1({
      //node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
      //clockseq: 0x1234,
      msecs: new Date().getTime(),
      nsecs: 5678
   });   
}

function getStaticUploadKey(uploadType) {
   var validOptions = [
      'profile_picture',
      'question_video',
      'question_picture',
      'comment_video',
      'comment_picture'
   ];

   if (-1 === validOptions.indexOf(uploadType)) {
      return null;
   } else {
      var matchArray = uploadType.match(/(\w+)_(\w+)/);

      if (!matchArray ||
          3 !== matchArray.length) {
         return null;       
      } else {
         return matchArray[1] + 
         "/" + matchArray[2] + "/" +
         getStaticUploadFilename();
      }
   }
}