'use strict';

let Spatial = require('./spatial');
let create = true;
exports.createSpatial = function createSpatial() {
  let ret =  new Spatial(create);
  create = false;
  return ret;
};

//module.exports = require('./spatial');
