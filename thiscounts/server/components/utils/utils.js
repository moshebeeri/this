'use strict';

var _ = require('lodash');
var logger = require('../logger').createLogger();
var async = require('async');

var User = require('../../api/user/user.model');
var Business = require('../../api/business/business.model');
var ShoppingChain = require('../../api/shoppingChain/shoppingChain.model');
var Product = require('../../api/product/product.model');
var Promotion = require('../../api/promotion/promotion.model');
var Mall = require('../../api/mall/mall.model');

function Utils(class_name) {
  //this.connect();
}

Utils.prototype.connect = function connect(){
  logger.info("--> Connect to Utils <--");
};

Utils.prototype.defined = function defined(obj){
  return (typeof obj !== 'undefined' && obj !== null);
};

Utils.prototype.log = function log(){
  return logger;
};

Utils.prototype.clean_phone_number = function clean_phone_number(number){
  // remove all non digits, and then remove 0 if it is the first digit
  return number.replace(/\D/g, '').replace(/^0/,'')
};

Utils.prototype.clean_name = function clean_phone_number(name){
  //var escaped_str = require('querystring').escape(name);
  //return escaped_str;
  return name.replace(/[-&\/\\#,+()$~%.'":*?<>{}]/g, '');
};

Utils.prototype.encode_name = function clean_phone_number(name){
  var b = new Buffer(name);
  var s = b.toString('base64');
  return s;
};

Utils.prototype.decode_name = function clean_phone_number(name){
  var b = new Buffer(name, 'base64');
  var s = b.toString();
  return s;
};

Utils.prototype.parallel_id =function set_parallel_id(itemId, element, callback){
  async.parallel({
    user: function (callback) {
      User.findById(itemId, callback);
    },
    business: function (callback) {
      Business.findById(itemId, callback);
    },
    chain: function (callback) {
      ShoppingChain.findById(itemId, callback);
    },
    product: function (callback) {
      Product.findById(itemId, callback);
    },
    promotion: function (callback) {
      Promotion.findById(itemId, callback);
    },
    mall: function (callback) {
      Mall.findById(itemId, callback);
    }
  }, function (err, results) {
    for (var key in results) {
      if (!_.isUndefined(results[key])) {
        switch (key) {
          case 'user':
            element.user = itemId;
            break;
          case 'business':
            element.business = itemId;
            break;
          case 'chain':
            element.chain = itemId;
            break;
          case 'product':
            element.product = itemId;
            break;
          case 'promotion':
            element.promotion = itemId;
            break;
          case 'mall':
            element.mall = itemId;
            break;
        }
        break;
      }
    }
    callback(null, element);
  });
};

Utils.prototype.to_paginate = function paginate(req){
  var skip = req.params.skip;
  var limit = req.params.limit;

  if(!utils.defined(skip) || !_.isNumber(skip))
    skip = 0;
  if(!utils.defined(limit) || !_.isNumber(limit))
    limit = 10;

  return {
    skip: skip,
    limit: limit
  }
};

module.exports = Utils;
