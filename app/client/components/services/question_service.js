'use strict';

var registerService = require('services/register');

var utils = require('utils');

var name = 'services.question';

registerService('factory', name, [require('services/http_service'),
                                  require('services/parallel_promise'),
                                  require('services/serial_promise'),
                                  require('services/promise'),
                                  require('services/progress'),
                                  require('services/media_service'),
                                  require('services/question_preview_picture_service'),
                                  require('services/api_url'),
                                  require('models/question'),
                                  require('models/comment'),
                                  require('services/error'),
function(HttpService, ParallelPromise, SerialPromise, Promise, Progress,
MediaService, QuestionPreviewPictureService, ApiUrlService, QuestionModel,
CommentModel, ErrorService) {
   function QuestionService() {
      
   }

   var currentQuestion = null;
   var currentQuestionIsNotAccessible = false;
   var currentQuestionIsNotFound = false;

   QuestionService.setCurrentQuestion = function(q) {
      currentQuestion = q;
      if (q) {
         currentQuestionIsNotAccessible = false;
         currentQuestionIsNotFound = false;
      }
   }

   QuestionService.updateCurrentQuestionIfSame = function(q) {
      if (currentQuestion) {
         if (currentQuestion.id === q.id) {
            currentQuestion.fromModel(q);
         }
      }
   }

   QuestionService.getCurrentQuestion = function() {
      return currentQuestion;
   }

   QuestionService.currentQuestionIsNotAccesible = function() {
      return currentQuestionIsNotAccessible;
   }

   QuestionService.currentQuestionIsNotFound = function() {
      return currentQuestionIsNotFound;
   }

   QuestionService.dataResolverFn = function(state, params) {
      if ('main.page.question.default' === state) {
         return Promise(function(resolve, reject) {
            if (!params.questionId) {
               reject(ErrorService.localError("Missing question id!"));
            } else {
               QuestionService.getQuestion(params.questionId)
               .then(function(question) {
                  QuestionService.setCurrentQuestion(question);
                  resolve();
               })
               .catch(function(error) {
                  QuestionService.setCurrentQuestion(null);

                  // Just like with the user, if we get an error,
                  // we want to display feedback on the page itself as to what
                  // went wrong, so we allow the request to finish (by resolving),
                  // but we set some internal stuff so we can get a better idea of what
                  // happened, so we can show the user on the page.

                  if (true === ErrorService.isForbidden(error)) {
                     currentQuestionIsNotAccesible = true;
                     resolve();
                  } else if (true === ErrorService.isNotFound(error)) {
                     currentQuestionIsNotFound = true;
                     resolve();
                  } else {
                     reject(error);
                  }
               })
            }
         });
      } else {
         QuestionService.setCurrentQuestion(null);
      }
   }
   
   QuestionService.ask = function(questionModel) {
      var previousQuestionModel = questionModel.clone();

      var serialPromiseFnArray = [
         function(existingData, index, forNotify) {
            return Promise(function(resolve, reject, notify) {
               if (false === forNotify) {
                  QuestionPreviewPictureService.getQuestionPreviewPicture(questionModel)
                  .then(function(picture) {
                     questionModel.preview_pictures[0] = picture;
                     resolve();
                  })
                  .catch(function(error) {
                     reject(error);
                  })
               }
            });
         },
         function(existingData, index, forNotify) {
            var pictureUploadFnArray = utils.map(questionModel.pictures, function(pictureModel) {
               return function(forNotify) {
                  return MediaService.uploadMedia('question_picture', pictureModel, forNotify);
               }
            });
      
            var videoUploadFnArray = utils.map(questionModel.videos, function(videoModel) {
               return function(forNotify) {
                  return MediaService.uploadMedia('question_video', videoModel, forNotify);
               }
            });

            var previewPictureUploadFnArray = utils.map(questionModel.preview_pictures, function(previewPictureModel) {
               return function(forNotify) {
                  return MediaService.uploadMedia('question_preview', previewPictureModel, forNotify);
               }
            });
      
            var mediaUploadFnArray = utils.merge(pictureUploadFnArray, videoUploadFnArray, previewPictureUploadFnArray);

            if (true === forNotify) {
               return ParallelPromise.getProgressSum(mediaUploadFnArray);   
            } else {
               return ParallelPromise.withNotify(mediaUploadFnArray)
            }
         },
         function(existingData, index, forNotify) {
            // Upload to the server.
            // At this point, all models are filled with their correct
            // URL's and such from the media uploader.
            if (false === forNotify) {
               return Promise(function(resolve, reject, notify) {
                  // Create the new question here
                  HttpService.post(ApiUrlService([
                     {
                        name: 'Question'
                     },
                     {
                        name: 'Ask'
                     }
                  ]), null, {question: questionModel.toObject(true)})
                  .then(function(data) {
                     resolve({question: new QuestionModel(data.data, true)})
                  })
                  .catch(function(error) {
                     reject(error);
                  })
               })
            }
         }
      ];

      return Promise(function(resolve, reject, notify) {
         SerialPromise.withNotify(serialPromiseFnArray, null, ['question'], true)
         .then(function(question) {
            resolve(question);
         }, null, function(progress) {
            notify(progress);
         })
         .catch(function(error) {
            questionModel.fromModel(previousQuestionModel);
            reject(error);
         });
      });
   }

   QuestionService.saveQuestion = function(question, oldQuestion) {
      return Promise(function(resolve, reject, notify) {
         var patch = question.createPatch(oldQuestion, true);
         if (!patch.length) {
            resolve(question);
         } else {
            HttpService.patch(ApiUrlService.getObjectUrl('Question', question.id),
               null, {data: patch})
            .then(function(data) {
               var question = new QuestionModel(data.data, true);
               QuestionService.updateCurrentQuestionIfSame(question);
               resolve(question);
            })
            .catch(function(error) {
               reject(error);
            })
         }
      });
   }

   QuestionService.addCommentToQuestion = function(question, comment) {
      return Promise(function(resolve, reject, notify) {
         HttpService.post(ApiUrlService([
            {
               name: 'Question',
               paramArray: [question.id]
            },
            {
               name: 'Comment'
            }
         ]), null, {comment: comment.toObject(true)})
         .then(function(data) {
            resolve(new CommentModel(data.data, true));
         })
         .catch(function(error) {
            reject(error);
         });
      });
   }

   QuestionService.getQuestion = function(questionId) {
      return Promise(function(resolve, reject) {
         HttpService.get(ApiUrlService.getObjectUrl('Question', questionId))
         .then(function(data) {
            resolve(new QuestionModel(data.data, true));
         })
         .catch(function(error) {
            reject(error);
         })
      });
   }
   
   return QuestionService;
}])

module.exports = name;