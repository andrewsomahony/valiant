'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VideoSchema = new Schema({
   url: {
      type: String,
      default: ""
   },
   title: {
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
   }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    _id: false
});

module.exports = VideoSchema;