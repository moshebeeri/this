'use strict';
var GraphModel = require('./graph-model');

exports.createGraphModel = function createGraphModel(class_name) {
  return new GraphModel(class_name);
}
