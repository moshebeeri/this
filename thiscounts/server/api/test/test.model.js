'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let TestSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  description: String,
  created: { type : Date, default: Date.now },
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  admins: [{ type: Schema.ObjectId, ref: 'User', index: true, unique: false}],
	user: {type: Schema.ObjectId, ref: 'User'},
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
		default: 'OPEN',
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
	active: Boolean,
  pictures : [],
	//business
	/*action: {type: String, default: ''},
	location : {
    lng : Number,
    lat : Number,
    //for internal use
    type: {type: String},
    coordinates: []
  },
	additional_contacts : {
    phone_description : String,
    phone : String,
    email_description : String,
    email : String
  },
	expireAt: {
    type: Date,
    validate: [ function(v) {
      return (v - new Date()) > 60000*(3600*24*2 - 1);
    }, 'Cannot expire less then 2 days in the future.' ],
    default: function() {
      // 2 days from now
      return new Date(new Date().valueOf() + 60000*3600*24*2);
    }
  }*/

});

module.exports = mongoose.model('Test', TestSchema);
