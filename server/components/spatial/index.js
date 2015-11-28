'use strict';

var Spatial = require('./spatial');

exports.createSpatial = function createSpatial(params) {
  return new Spatial(params);
};
