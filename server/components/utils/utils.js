'use strict';

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
  return number.replace(/\D/g, '');
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

module.exports = Utils;
