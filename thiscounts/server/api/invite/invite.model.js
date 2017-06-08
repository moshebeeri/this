'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let InviteSchema = new Schema({
  text: String,
  gid: { type: Number, index: true},
  creator: {type: Schema.ObjectId, ref: 'User', required: true},
  mall : {type: Schema.ObjectId, ref: 'Mall', required: false},
  shopping_chain: {type: Schema.ObjectId, ref: 'ShoppingChain', required: false},
  business: {type: Schema.ObjectId, ref: 'Business'},

  offers: [{type: Schema.ObjectId, ref: 'Offer', required: true}],
  invited_users: [{type: Schema.ObjectId, ref: 'User', required: true}],
  invited_groups: [{type: Schema.ObjectId, ref: 'Group', required: true}],
  start: { type : Date, default: Date.now },
  end: Date,
  expireAt: {
    type: Date,
    validate: [ function(v) {
      return (v - new Date()) > 60000*(3600*24*2 - 1);
    }, 'Cannot expire less then 2 days in the future.' ],
    default: function() {
      // 2 days from now
      return new Date(new Date().valueOf() + 60000*3600*24*2);
    }
  }
});

module.exports = mongoose.model('Invite', InviteSchema);
