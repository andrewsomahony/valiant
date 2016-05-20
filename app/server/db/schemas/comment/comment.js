'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VideoSchema = require(__base + 'db/schemas/video/video');
var PictureSchema = require(__base + 'db/schemas/picture/picture');

var CommentSchema = new Schema({
   text: {
      type: String,
      default: ""
   },
   videos: {
      type: [VideoSchema],
      default: []
   },
   pictures: {
      type: [PictureSchema],
      default: []
   }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    _id: false
});

module.exports = CommentSchema;