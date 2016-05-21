'use strict';

var registerService = require('services/register');

var name = 'services.question';

registerService('factory', name, [require('services/http_service'),
function(HttpService) {
   function QuestionService() {
      
   }
   
   QuestionService.getSelectableQuestionTypes = function() {
      return [
         "Swimming"
      ];
   }
   
   return QuestionService;
}])

module.exports = name;