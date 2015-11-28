'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActivitySchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  user: {type: Schema.ObjectId, ref: 'User', required: true},
  component: {type: Schema.Types.ObjectId, required: true},

});

module.exports = mongoose.model('Activity', ActivitySchema);
