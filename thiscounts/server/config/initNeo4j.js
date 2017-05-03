'use strict';
const graphTools = require('../components/graph-tools');
const Promotion = require('../api/promotion/promotion.model');


initNeo4j();

function initNeo4j() {
  const PromotionType = graphTools.createGraphModel('PromotionType');
  PromotionType.model.setUniqueKey('PromotionType', true);
  const db = PromotionType.db();
  const typEnum = Promotion.schema.path('type').enumValues;
  typEnum.forEach(function(typeStr){
    PromotionType.save({PromotionType: typeStr}, function(err, obj){
      if(err) console.log("failed " + err.message);
      else console.log("PromotionType " + JSON.stringify(obj) + " created");
    });
  });
  const SocialType = graphTools.createGraphModel('SocialType');
  SocialType.model.setUniqueKey('SocialType', true);
  const socialEnum = Promotion.schema.path('social').enumValues;
  socialEnum.forEach(function(typeStr){
    SocialType.save({SocialType: typeStr}, function(err, obj){
      if(err) console.log("failed " + err.message);
      else console.log("SocialType " + JSON.stringify(obj) + " created");
    });
  });
  // create indexes
  db.index.createIfNone('activity', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('brand', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('business', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('card', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('cardType', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('campaign', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('category', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('feed', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('group', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('mall', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('phone_number', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('phonebook', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('product', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('promotion', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('shoppingChain', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('user', '_id', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('user', 'phone', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('PromotionType', 'PromotionType', function(err, index) {
    console.log(index);
  });
  db.index.createIfNone('SocialType', 'SocialType', function(err, index) {
    console.log(index);
  });
}
