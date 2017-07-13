'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');



const promotionSchemaObject = require('./promotion.schema');
const PromotionSchema = new Schema(promotionSchemaObject);
PromotionSchema.index({ location: '2dsphere' });

PromotionSchema
  .pre('save', function(next) {
    //if (!this.isNew) return next();
    /*if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
     next(new Error('Invalid password'));
     else*/
    next();
  });
PromotionSchema.plugin(autopopulate);

//http://mongoosejs.com/docs/2.7.x/docs/validation.html
//PromotionSchema.path('percent_range').validate(function (v, fn) {
//  fn(v.from< v.to);
//}, 'invalid range');
//

module.exports = mongoose.model('Promotion', PromotionSchema);
