'use strict';

let mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');
//pricing free tier
let BusinessSchema = new Schema({
  social_state: {},
  pricing: {type: Schema.ObjectId, ref: 'Pricing', autopopulate: true},
  name: {type: String, index: true, required: true},
  gid: {type: Number, index: true},
  tax_id: {type: String, index: true, required: true},
  shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', required: false},
  mall: {type: Schema.ObjectId, ref: 'Mall', required: false},
  description: String,
  address: {type: String, required: true},
  address2: String,
  city: {type: String, required: true},
  country: {type: String, required: true},
  category: {type: String, required: true},
  subcategory: {type: String, required: true},
  state: {type: String},
  main_phone_number: String,
  email: {type: String, index: true, required: true},
  email_validate: {type: String, required: true},
  website: String,
  creator: {type: Schema.ObjectId, index: true, ref: 'User', required: true},
  created: {type: Date, required: true},
  info: String,

  default_group: {type: Schema.ObjectId, index: true, ref: 'Group'},
  groups: [{type: Schema.ObjectId, index: true, ref: 'Group'}],
  qrcode: {type: Schema.ObjectId, ref:'QRCode'},

  location: {
    lng: Number,
    lat: Number,
    //for internal use
    type: {type: String},
    coordinates: []
  },
  id: String,
  type: {
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
  client: {},
  pictures: [],
  letterOfIncorporation: {type: String},
  identificationCard: {type: String},
  video: {type: Schema.ObjectId, ref: 'Video', autopopulate: true}
});
BusinessSchema.plugin(autopopulate);

BusinessSchema.index({
  name: 'text',
  description: 'text',
  address: 'text',
  address2: 'text',
  city: 'text',
  state: 'text',
  website: 'text',
  info: 'text'
});

let model = mongoose.model('Business', BusinessSchema);
model.collection.ensureIndex({
  name: 'text',
  description: 'text',
  address: 'text',
  address2: 'text',
  city: 'text',
  state: 'text',
  website: 'text',
  info: 'text'
});

module.exports = mongoose.model('Business', BusinessSchema);

