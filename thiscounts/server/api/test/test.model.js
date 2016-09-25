'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TestSchema = new Schema({
  name: String,
  gid: { type: Number, index: true, unique : true },
  description: String,
  created: { type : Date, default: Date.now },
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  admins: [{ type: Schema.ObjectId, ref: 'User', index: true, unique: false}],
  _select: {
    type: String,
    required : true,
    enum: [
			'select',
      'OPEN',         //  any one can add himself
      'CLOSE',        //  only admin adds
      'REQUEST',      //  anyone can request to be added
      'ADMIN_INVITE', //  admin invite
      'MEMBER_INVITE' //  member invite
    ]
  },
	_radio: {
    type: String,
    required : true,
    enum: [
			'radio',
      'OPEN',         //  any one can add himself
      'CLOSE',        //  only admin adds
      'REQUEST',      //  anyone can request to be added
      'ADMIN_INVITE', //  admin invite
      'MEMBER_INVITE' //  member invite
    ]
  },
	_checkbox: {
    type: String,
    required : true,
    enum: [
			'checkbox',
      'OPEN',         //  any one can add himself
      'CLOSE',        //  only admin adds
      'REQUEST',      //  anyone can request to be added
      'ADMIN_INVITE', //  admin invite
      'MEMBER_INVITE' //  member invite
    ]
  },
  rami: {
    type: Array,
    required : true
  },
  pictures : []

});

module.exports = mongoose.model('Test', TestSchema);
