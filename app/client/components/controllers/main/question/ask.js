'use strict';

var registerController = require('controllers/register');

var utils = require('utils');

var name = 'controllers.main.question.ask';

registerController(name, ['$scope',
                          require('services/question_service'),
                          require('models/question'),
                          require('services/device_service'),
                          require('services/s3_uploader_service'),
                          require('services/promise'),
                          require('services/parallel_promise'),
function($scope, QuestionService, QuestionModel,
DeviceService, S3UploaderService, Promise, ParallelPromise) {
   $scope.questionTopicOptions = QuestionService.getSelectableQuestionTypes();

   $scope.allocateNewQuestion = function() {
      $scope.currentQuestion = new QuestionModel();  
      $scope.currentQuestion.topic = $scope.questionTopicOptions[0];
   
      if (DeviceService.isDesktop()) {
         // Desktops have more memory in general
         // and can convert more videos using our
         // videoconverter.js
         $scope.currentQuestion.allocateVideos(2);
         $scope.currentQuestion.allocatePictures(3);
      } else {
         // Mobile devices tend to only be able to handle
         // conversion of one video.
         $scope.currentQuestion.allocateVideos(1);
         $scope.currentQuestion.allocatePictures(2);
      }
   }
   
   $scope.askQuestion = function() {
      /*var promiseFnArray = [];
      
      promiseFnArray.merge(utils.map($scope.currentQuestion.pictures, function(pictureModel) {
         return function(forNotify) {
            if (true === forNotify) {
               return S3UploaderService.getProgressInfo('question_picture', pictureModel.file_model);
            } else {
               return Promise(function(resolve, reject, notify) {
                  S3UploaderService('question_picture', pictureModel.file_model)
                  .then(function(data) {
                     pictureModel.url = data.url;
                     pictureModel.fileModel = null;
                     pictureModel.s3_upload_progress = null;
                     resolve();
                  }, null, function(progress) {
                     pictureModel.s3_upload_progress = progress;
                     notify(progress);
                  })
                  .catch(function(error) {
                     reject(error);
                  });
               });
            }
         }
      }));*/
   }
   
   $scope.allocateNewQuestion();
}]);

module.exports = name;