'use strict';

var Spatial = require('./spatial');
var create = true;
exports.createSpatial = function createSpatial() {
  var ret =  new Spatial(create);
  create = false;
  return ret;
};

//module.exports = require('./spatial');
