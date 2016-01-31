'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeedSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User', required: true},
  activity: {type: Schema.ObjectId, ref: 'activity'}
});

module.exports = mongoose.model('Feed', FeedSchema);
