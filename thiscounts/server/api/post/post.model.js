'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let utils = require('../../components/utils').createUtils();
const autopopulate = require('mongoose-autopopulate');

let PostSchema = new Schema({
  social_state : {},
  title: {type: String, required: true},
  gid: {type: Number, index: true},
  creator: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions},
  created: {type: Date, required: true},
  behalf: {
    user: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions},
    group: {type: Schema.ObjectId, ref: 'Group', autopopulate: true},
    business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
    mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true},
    chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
  },
  text: String,
  url: String,
  pictures:[],
  video: {type: Schema.ObjectId, ref: 'Video', autopopulate: true}
});
PostSchema.plugin(autopopulate);
module.exports = mongoose.model('Post', PostSchema);
