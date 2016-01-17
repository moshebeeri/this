'use strict';

var logger = require('../logger').createLogger();

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


module.exports = Utils;
