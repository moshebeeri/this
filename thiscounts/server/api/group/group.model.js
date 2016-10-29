'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  name: String,
  gid: { type: Number, index: true, unique: true },
  description: String,
  created: { type: Date, default: Date.now },
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  admins: [{ type: Schema.ObjectId, ref: 'User', index: true, unique: false}],
  creator_type: {
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
  pictures: []

});

module.exports = mongoose.model('Group', GroupSchema);
