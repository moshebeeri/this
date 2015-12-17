'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BusinessSchema = new Schema({
  name: String,
  gid: Number,
  shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', required: false},
  description : String,
  address : String,
  address2 : String,
  city : String,
  state : String,
  main_phone_number : String,
  email : String,
  website : String,
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  info: String,
  active: Boolean,
  location : {
    lat : String,
    long : String
  },
  id : String,
  type:{
    type: String,
    enum: ['PERSONAL_SERVICES', 'SMALL_BUSINESS', 'COMPANY', 'ENTERPRISE'],
    required : true
  },
  additional_contacts : {
    phone_description : String,
    phone : String,
    email_description : String,
    email : String,
  },
  logo : String,
  pictures : [String]
});

module.exports = mongoose.model('Business', BusinessSchema);

//module.exports = function() {
//  var schema = new Schema({
//    ...
//  });
//
//  mongoose.model('Business', schema);
//};
