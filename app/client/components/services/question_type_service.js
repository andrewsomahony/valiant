'use strict';

var registerService = require('services/register');

var name = 'services.question_type';

registerService('factory', name, [
function() {
   function QuestionTypeService() {

   }

   QuestionTypeService.getQuestionTypes = function() {
      return [{
            name: "Swimming",
            picture_url: "/images/swimming_placeholder.png"
         }, {
            name: null,
            picture_url: "/images/question_placeholder.png"
         }
      ];      
   }

   return QuestionTypeService;
}
]);

module.exports = name;