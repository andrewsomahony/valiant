'use strict';

var mongoose = require('mongoose');
var utils = require(__base + 'lib/utils');

var Schema = mongoose.Schema;

var SetElementModificationSchema = new Schema({
   name: {
      type: String,
      default: ""
   },
   is_optional: {
      type: Boolean,
      default: false
   }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    _id: false
});

module.exports = SetElementModificationSchema;