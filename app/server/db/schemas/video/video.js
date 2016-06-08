'use strict';

var mongoose = require('mongoose');

var PictureSchema = require(__base + "db/schemas/picture/picture");

var Schema = mongoose.Schema;

var VideoSchema = new Schema({
   url: {
      type: String,
      default: ""
   },
   subtitle_url: {
      type: String,
      default: ""  
   },
   description: {
      type: String,
      default: ""
   },
   metadata: {
      type: {},
      default: {}
   },
   thumbnail: PictureSchema
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    _id: false
});

module.exports = VideoSchema;