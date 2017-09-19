'use strict';

let _ = require('lodash');
let logger = require('../logger').createLogger();
let async = require('async');

let User = require('../../api/user/user.model');
let Business = require('../../api/business/business.model');
let ShoppingChain = require('../../api/shoppingChain/shoppingChain.model');
let Product = require('../../api/product/product.model');
let Promotion = require('../../api/promotion/promotion.model');
let Mall = require('../../api/mall/mall.model');

function Utils(class_name) {
}

Utils.prototype.undefined = function is_undefined(obj){
  return !this.defined(obj);
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
  //let escaped_str = require('querystring').escape(name);
  //return escaped_str;
  return name.replace(/[-&\/\\#,+()$~%.'":*?<>{}]/g, '');
};

Utils.prototype.encode_name = function clean_phone_number(name){
  let b = new Buffer(name);
  return b.toString('base64');
};

Utils.prototype.decode_name = function clean_phone_number(name){
  let b = new Buffer(name, 'base64');
  return b.toString();
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
    for (let key in results) {
      if (results.hasOwnProperty(key) && !_.isUndefined(results[key])) {
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
  let skip = req.params.skip;
  let limit = req.params.limit;

  if(!this.defined(skip) || !_.isNumber(skip))
    skip = 0;
  if(!this.defined(limit) || !_.isNumber(limit))
    limit = 25;

  return {
    skip: skip,
    limit: limit
  }
};
Utils.prototype.minMax = function (value, value2) {
  if (value < value2) {
    return {
      min: value,
      max: value2
    }
  }
  return {
    min: value2,
    max: value
  }
};
Utils.prototype.userAutopopulateOptions = function(){
  return { select: '-sms_code -role -gid -__v -firebase -hashedPassword -provider -salt -facebook -twitter - google -github' }

};
module.exports = Utils;
