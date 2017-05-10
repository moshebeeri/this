'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


function entity_validator(v) {
  if (_.isNull(v))
    return false;
  return v.user || v.business || v.shopping_chain || v.mall;
}

const Entities = {
  user: {type: Schema.ObjectId, ref: 'User'},
  business: {type: Schema.ObjectId, ref: 'Business'},
  shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain'},
  mall: {type: Schema.ObjectId, ref: 'Mall'}
};

const GroupSchema = new Schema({
  name: String,
  gid: { type: Number, index: true},
  description: String,
  created: {type: Date, default: Date.now },
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  admins: [{type: Schema.ObjectId, ref: 'User', index: true}],

  entity: {type: Entities, require: true,
    validate: [entity_validator, 'at least on of those fields should not be empty [business, user, chain, mall]'],
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
  pictures: []
});

module.exports = mongoose.model('Group', GroupSchema);
