'use strict';

var mongoose = require('mongoose');

var patchPlugin = require('mongoose-json-patch');

var Schema = mongoose.Schema;

var PictureSchema = new Schema({
   url: {
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

PictureSchema.plugin(patchPlugin);

module.exports = PictureSchema;