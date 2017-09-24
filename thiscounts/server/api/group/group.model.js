'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let _ = require('lodash');
let utils = require('../../components/utils').createUtils();
const autopopulate = require('mongoose-autopopulate');

function entity_validator(v) {
  if (_.isNull(v))
    return false;
  let i = 0;
  if(utils.defined(v.user))
    i++;
  if(utils.defined(v.business))
    i++;
  if(utils.defined(v.shopping_chain))
    i++;
  if(utils.defined(v.mall))
    i++;
  return i === 1
}


const GroupSchema = new Schema({
  social_state: {},
  touched: {},
  role: {},
  name: String,
  gid: {type: Number, index: true},
  description: String,
  created: {type: Date, default: Date.now},
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  admins: [{type: Schema.ObjectId, ref: 'User', index: true}],
  qrcode: {type: Schema.ObjectId, ref:'QRCode'},
  preview: {
    message_activity: {type: Schema.ObjectId, ref: 'Activity'},
    instance_activity: {type: Schema.ObjectId, ref: 'Activity'},
  },
  entity: {
    user: {type: Schema.ObjectId, ref: 'User', autopopulate: utils.userAutopopulateOptions},
    business: {type: Schema.ObjectId, ref: 'Business', autopopulate: true},
    shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', autopopulate: true},
    mall: {type: Schema.ObjectId, ref: 'Mall', autopopulate: true},
  },
  entity_type: {
    type: String,
    required: true,
    enum: [
      'BUSINESS',
      'CHAIN',
      'MALL',
      'USERS'
    ]
  },
  add_policy: {
    type: String,
    required: true,
    enum: [
      'OPEN',         //  any one can add himself
      'CLOSE',        //  only admin adds
      'REQUEST',      //  anyone can request to be added
      'ADMIN_INVITE', //  admin invite
      'MEMBER_INVITE' //  member invite
    ]
  },
  post_policy: {
    type: String,
    required: true,
    enum: [
      'ANYONE',
      'MEMBERS',
      'ADMINS',
      'MANAGERS'
    ]
  },
  pictures: []
});
GroupSchema.index({name: 'text', description: 'text'});
GroupSchema.plugin(autopopulate);

module.exports = mongoose.model('Group', GroupSchema);
