'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let FeedSchema = new Schema({
  entity: {type: Schema.ObjectId, required: true, index: true},
  activity: {type: Schema.ObjectId, ref: 'Activity', required: true, index: true}
});

module.exports = mongoose.model('Feed', FeedSchema);




//collection: String,
//updated: {type: Date, default: Date.now},
//created: {type: Date, default: Date.now},
