'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VideoSchema = require(__base + 'db/schemas/video/video');
var PictureSchema = require(__base + 'db/schemas/picture/picture');
var CommentSchema = require(__base + 'db/schemas/comment/comment');

var QuestionSchema = new Schema({
   topic: {
     type: String,
     default: ""  
   },
   custom_topic: {
     type: String,
     default: ""  
   },
   text: {
      type: String,
      default: ""
   },
   youtube_video: VideoSchema,
   videos: {
      type: [VideoSchema],
      default: []
   },
   pictures: {
      type: [PictureSchema],
      default: []
   },
   comments: {
      type: [CommentSchema],
      default: []
   },
   preview_pictures: {
      type: [PictureSchema],
      default: []
   },
   creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = QuestionSchema;