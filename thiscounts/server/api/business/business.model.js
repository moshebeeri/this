'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let BusinessSchema = new Schema({social_state: {},
  name: { type: String, index: true, required: true},
  gid: { type: Number, index: true},
  tax_id: { type: String, index: true, required: true} ,
  shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', required: false},
  mall: {type: Schema.ObjectId, ref: 'mall', required: false},
  description: String,
  address: {type: String, required: true},
  address2: String,
  city: {type: String, required: true},
  country: {type: String, required: true},
  state: {type: String},
  main_phone_number: String,
  email: { type: String, index: true, required: true},
  website: String,
  creator: {type: Schema.ObjectId, index: true, ref: 'User', required: true},
  created: {type: Date, default: Date.now},
  info: String,

  default_group: {type: Schema.ObjectId, index: true, ref: 'Group'},
  groups: [{type: Schema.ObjectId, index: true, ref: 'Group'}],

  location: {
    lng: Number,
    lat: Number,
    //for internal use
    type: {type: String},
    coordinates: []
  },
  id: String,
  type:{
    type: String,
    enum: ['PERSONAL_SERVICES', 'SMALL_BUSINESS', 'PARTNERSHIP', 'COMPANY', 'ENTERPRISE'],
    required: true
  },
  additional_contacts: {
    phone_description: String,
    phone: String,
    email_description: String,
    email: String
  },
  logo: String,
  pictures: []
});

module.exports = mongoose.model('Business', BusinessSchema);

//module.exports = function() {
//  let schema = new Schema({
//    ...
//  });
//
//  mongoose.model('Business', schema);
//};
