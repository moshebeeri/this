'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

let CommentSchema = new Schema({
  gid: { type: Number, index: true},
  user: {type: Schema.ObjectId, ref: 'User', index: true, autopopulate: true, required: true},
  message: String,
  pictures: [],
  entities: {
    group               : {type: Schema.ObjectId, ref: 'Group', index: true, autopopulate: true},
    brand               : {type: Schema.ObjectId, ref: 'Brand', index: true, autopopulate: true},
    business            : {type: Schema.ObjectId, ref: 'Business', index: true, autopopulate: true},
    shopping_chain      : {type: Schema.ObjectId, ref: 'ShoppingChain', index: true, autopopulate: true},
    mall                : {type: Schema.ObjectId, ref: 'Mall', index: true, autopopulate: true},
    product             : {type: Schema.ObjectId, ref: 'Product', index: true, autopopulate: true},
    promotion           : {type: Schema.ObjectId, ref: 'Promotion', index: true, autopopulate: true},
    instance            : {type: Schema.ObjectId, ref: 'Instance', index: true, autopopulate: true}
  }
});
CommentSchema.plugin(autopopulate);

// CommentSchema
//   .pre('save', function(next) {
//     let val =
//     (this.entity.brand             ? 1 : 0)+
//     (this.entity.business          ? 1 : 0)+
//     (this.entity.shopping_chain    ? 1 : 0)+
//     (this.entity.mall              ? 1 : 0)+
//     (this.entity.product           ? 1 : 0)+
//     (this.entity.promotion         ? 1 : 0)+
//     (this.entity.instance          ? 1 : 0)+
//
//     if(val !== 1)
//       return next(new Error('one of entity fields should be set'));
//     next();
//   });

module.exports = mongoose.model('Comment', CommentSchema);
