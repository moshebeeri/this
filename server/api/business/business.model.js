'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BusinessSchema = new Schema({
  name: { type: String, index: true, unique : true, required : true, dropDups: false},
  gid: Number,
  shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', required: false},
  description : String,
  address : String,
  address2 : String,
  city : String,
  state : String,
  main_phone_number : String,
  email : { type: String, index: true, unique : true, required : true, dropDups: false},
  website : String,
  owner: {type: Schema.ObjectId, ref: 'User', required: true},
  info: String,
  active: Boolean,
  location : {
    lat : String,
    lon : String
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
