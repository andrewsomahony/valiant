'use strict';

var aws = require('aws-sdk');

var appConfig = require(__base + 'config/config');

var Promise = require(__base + 'lib/promise');
var ValiantError = require(__base + 'lib/error');

module.exports = s3;
module.exports.signPutRequest = signPutRequest;
module.exports.signGetRequest = signGetRequest;

function s3() {
   var awsKey = appConfig.secure('VALIANT_AWS_ACCESS_KEY');
   var awsSecret = appConfig.secure('VALIANT_AWS_SECRET_KEY');

   aws.config.update({
      accessKeyId: awsKey,
      secretAccessKey: awsSecret
   });
}

function signPutRequest(key, contentType, acl, expires) {
   return Promise(function(resolve, reject, notify) {
      var bucket = appConfig.secure('VALIANT_AWS_S3_BUCKET');
      
      if (!key) {
         reject(ValiantError.withMessage("Missing key!"));
      }
      
      if (!contentType) {
         reject(ValiantError.withMessage("Missing content type!"));
      }
      
      var s3 = new aws.S3();
   
      var params = {
         Bucket: bucket,
         Key: key,
         ContentType: contentType,
         Expires: expires || 60,
         ACL: acl
      };
 
      s3.getSignedUrl('putObject', params, function(error, url) {
         if (error) {
            reject(new ValiantError.fromErrorObject(error));
         } else {
            resolve({
               signed_url: url,
               public_url: "https://" + bucket + ".s3.amazonaws.com/" + key
            });  
         }
      });      
   });
   

   /*
       var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
   */
}

function signGetRequest(bucket, key) {
   
}