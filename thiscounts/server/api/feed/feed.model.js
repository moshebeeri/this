'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeedSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  group: {type: Schema.ObjectId, ref: 'Group'},
  activity: {type: Schema.ObjectId, ref: 'Activity'}
});

module.exports = mongoose.model('Feed', FeedSchema);




//collection: String,
//updated: {type: Date, default: Date.now},
//created: {type: Date, default: Date.now},
