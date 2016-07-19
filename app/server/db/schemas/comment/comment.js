'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VideoSchema = require(__base + 'db/schemas/video/video');
var PictureSchema = require(__base + 'db/schemas/picture/picture');

var genericMethods = require(__base + 'db/schemas/plugins/methods');
var commentMethods = require('./plugins/methods');

var CommentSchema = new Schema({
   text: {
      type: String,
      default: ""
   },
   _creator: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    _id: false
});

CommentSchema.plugin(genericMethods);
CommentSchema.plugin(commentMethods);

module.exports = CommentSchema;