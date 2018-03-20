'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let FeedSchema = new Schema({
  entity: {type: Schema.ObjectId, required: true, index: true},
  activity: {type: Schema.ObjectId, ref: 'Activity', required: true, index: true, autopopulate: true},
  probability: {type: Number, min:0, max:1, default:1}
});
FeedSchema.plugin(autopopulate);

module.exports = mongoose.model('Feed', FeedSchema);
