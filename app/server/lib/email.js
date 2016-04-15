'use strict';

var path = require('path');

var appConfig = require(__base + 'config/config');
var sendgridKey = 'WHEREARE_MUH_ROADS';
var sendgrid = require('sendgrid')(appConfig.secure(sendgridKey));

var EmailTemplate = require('email-templates').EmailTemplate;

var hostnameUtil = require(__base + 'lib/hostname');

module.exports = function(options, cb) {
   /*
      options.to
      options.from,
      options.fromname,
      options.subject
      options.template
      options.text
      options.html
      options.templateParams
    */
    
   options = options || {};
   
   options.to = options.to || "";
   options.from = options.from || "";
   options.fromname = options.fromname || "";
   options.subject = options.subject || "";
   options.template = options.template || "";
   options.text = options.text || "";
   options.html = options.html || "";
   options.templateParams = options.templateParams || {};
   
   var email = new sendgrid.Email();
   
   email.to = options.to;
   email.from = options.from;
   email.fromname = options.fromname;
   email.subject = options.subject;
   email.text = options.text;
   email.html = options.html;
   
   if (options.template) {
      var templateDirectory = path.join(__base, 'email-templates', options.template);
      
      var template = new EmailTemplate(templateDirectory);
      template.render(options.templateParams, function(error, result) {
         if (error) {
            cb(error);
         } else {
            email.text = result.text;
            email.html = result.html;
            email.subject = result.subject || options.subject;
            
            sendgrid.send(email, function(error, json) {
               if (error) {
                  cb(error);
               } else {
                  cb();
               }
            })
         }
      });
   } else {
      sendgrid.send(email, function(error, json) {
         if (error) {
            cb(error);
         } else {
            cb();
         }
      });
   }
}

module.exports.constructEmailAddress = constructEmailAddress;
module.exports.doNotReplyEmailAddress = doNotReplyEmailAddress;

function constructEmailAddress(name) {
   var hostname = hostnameUtil.getHostNameWithoutPort();
   
   return name + "@" + hostname;   
}

function doNotReplyEmailAddress() {
   return constructEmailAddress('do-not-reply');
}